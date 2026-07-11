"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Droplet, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { Card, EmptyState, Skeleton } from "@/components/ui/misc";
import { ApiError } from "@/lib/api";
import { useAddDonation, useDeleteDonation, useDonations } from "@/lib/hooks";
import type { Donation } from "@/lib/types";
import { formatDate, todayISO } from "@/lib/utils";
import { donationSchema, type DonationInput } from "@/lib/validation";

export function DonationsSection() {
  const donations = useDonations();
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<Donation | null>(null);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Donation history</h2>
          <p className="text-sm text-slate-500">Every donation you record keeps your eligibility accurate.</p>
        </div>
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus className="size-4" aria-hidden />
          Record donation
        </Button>
      </div>

      {donations.isLoading ? (
        <div className="space-y-3 p-6">
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      ) : donations.data && donations.data.length > 0 ? (
        <ul className="divide-y divide-slate-100">
          {donations.data.map((donation) => (
            <li key={donation.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Droplet className="size-4 fill-current" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{formatDate(donation.donation_date)}</p>
                  <p className="text-xs text-slate-500">
                    {donation.amount ? `${donation.amount} ml` : "Amount not recorded"}
                    {donation.note && ` · ${donation.note}`}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Delete donation on ${formatDate(donation.donation_date)}`}
                onClick={() => setDeleting(donation)}
              >
                <Trash2 className="size-4 text-slate-400 hover:text-red-500" aria-hidden />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-6">
          <EmptyState
            title="No donations recorded yet"
            description="Record your first donation and we'll track when you're next eligible."
            action={
              <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
                <Plus className="size-4" aria-hidden />
                Record donation
              </Button>
            }
          />
        </div>
      )}

      <AddDonationModal open={adding} onClose={() => setAdding(false)} />
      <DeleteDonationModal donation={deleting} onClose={() => setDeleting(null)} />
    </Card>
  );
}

function AddDonationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addDonation = useAddDonation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: { date: todayISO(), amount: 450 },
  });

  const onSubmit = (values: DonationInput) => {
    addDonation.mutate(
      { date: values.date, amount: values.amount, note: values.note || undefined },
      {
        onSuccess: (response) => {
          toast.success(response.message || "Donation recorded — thank you!");
          reset({ date: todayISO(), amount: 450, note: "" });
          onClose();
        },
        onError: (error) => {
          if (error instanceof ApiError && error.errors?.date) {
            setError("date", { type: "server", message: error.errors.date[0] });
          } else {
            toast.error(error instanceof ApiError ? error.message : "Could not record the donation.");
          }
        },
      },
    );
  };

  return (
    <Modal open={open} onClose={onClose} title="Record a donation">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <InputField
          label="Donation date"
          required
          type="date"
          max={todayISO()}
          error={errors.date?.message}
          {...register("date")}
        />
        <InputField
          label="Amount (ml)"
          required
          type="number"
          min={100}
          max={1000}
          step={10}
          hint="A whole-blood donation is typically 350–450 ml."
          error={errors.amount?.message}
          {...register("amount")}
        />
        <InputField
          label="Note (optional)"
          placeholder="e.g. City Hospital, platelet donation…"
          error={errors.note?.message}
          {...register("note")}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={addDonation.isPending}>
            Save donation
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteDonationModal({ donation, onClose }: { donation: Donation | null; onClose: () => void }) {
  const deleteDonation = useDeleteDonation();

  return (
    <Modal open={Boolean(donation)} onClose={onClose} title="Delete this donation?">
      <p className="text-sm text-slate-500">
        The donation recorded on{" "}
        <span className="font-semibold text-slate-800">{formatDate(donation?.donation_date)}</span>{" "}
        will be removed permanently. This also affects your eligibility date.
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          loading={deleteDonation.isPending}
          onClick={() =>
            donation &&
            deleteDonation.mutate(donation.id, {
              onSuccess: (response) => {
                toast.success(response.message || "Donation deleted.");
                onClose();
              },
              onError: (error) =>
                toast.error(error instanceof ApiError ? error.message : "Could not delete the donation."),
            })
          }
        >
          <Trash2 className="size-4" aria-hidden />
          Delete
        </Button>
      </div>
    </Modal>
  );
}

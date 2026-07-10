import { Skeleton } from "@mui/material";

const UserProfileSkeliton = () => {
    return (
        <>
            <div className="grid lg:grid-cols-2 gap-x-6 mb-4">
                <div className="sm:flex lg:justify-between gap-x-8 lg:gap-x-0 w-full mb-4 lg:mb-0">
                    <Skeleton className="mb-4 sm:mb-0" variant="rounded" animation="wave" width={190} height={30} />
                    <Skeleton variant="rounded" animation="wave" width={200} height={30} />
                </div>
                <div className="flex sm:justify-end gap-x-3">
                    <Skeleton variant="rounded" animation="wave" height={40} className="w-full" />
                    <Skeleton variant="rounded" animation="wave" height={40} className="w-full" />
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
                <Skeleton variant="rounded" animation="wave" height={140} className="w-full" />
                <Skeleton variant="rounded" animation="wave" height={140} className="w-full" />
            </div>
        </>
    );
}

export default UserProfileSkeliton;

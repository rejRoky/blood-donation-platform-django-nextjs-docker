"""
Password-reset OTP service.

Flow (all state lives in the cache, nothing touches the DB until the final step):

1. send_otp(mobile)      -> generates an OTP, stores it with a TTL, dispatches SMS
2. verify_otp(mobile, o) -> checks the OTP (max N attempts), returns a one-time
                            reset token on success
3. consume_reset_token(mobile, token) -> validates + invalidates the token;
                            caller may then set the new password

The reset token exists so that knowing *only* the mobile number is never enough
to set a password: the token is returned exclusively to the client that passed
OTP verification.
"""

import logging
import secrets

from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)

_OTP_KEY = 'reset_otp:{mobile}'
_ATTEMPTS_KEY = 'reset_otp_attempts:{mobile}'
_TOKEN_KEY = 'reset_token:{mobile}'


def _generate_otp():
    length = getattr(settings, 'OTP_LENGTH', 6)
    return ''.join(secrets.choice('0123456789') for _ in range(length))


def send_sms(mobile_number, message):
    """
    Dispatch an SMS through the configured gateway.

    No gateway is wired up yet; plug your provider (e.g. SSLWireless, Twilio,
    BulkSMS BD) in here. Until then the message is only logged so the flow can
    be exercised in development.
    """
    logger.info("SMS to %s: %s", mobile_number, message)


def send_otp(mobile_number):
    """Generate and dispatch a password-reset OTP. Returns the OTP."""
    otp = _generate_otp()
    ttl = settings.OTP_TTL_SECONDS
    cache.set(_OTP_KEY.format(mobile=mobile_number), otp, timeout=ttl)
    cache.delete(_ATTEMPTS_KEY.format(mobile=mobile_number))
    send_sms(
        mobile_number,
        f'Your password reset code is {otp}. It expires in {ttl // 60} minutes.',
    )
    return otp


def verify_otp(mobile_number, otp):
    """
    Verify an OTP. Returns a one-time reset token on success, None on failure.
    The OTP is invalidated after OTP_MAX_VERIFY_ATTEMPTS wrong guesses.
    """
    otp_key = _OTP_KEY.format(mobile=mobile_number)
    attempts_key = _ATTEMPTS_KEY.format(mobile=mobile_number)

    cached_otp = cache.get(otp_key)
    if cached_otp is None:
        return None

    if not secrets.compare_digest(str(cached_otp), str(otp)):
        try:
            attempts = cache.incr(attempts_key)
        except ValueError:
            cache.set(attempts_key, 1, timeout=settings.OTP_TTL_SECONDS)
            attempts = 1
        if attempts >= settings.OTP_MAX_VERIFY_ATTEMPTS:
            cache.delete(otp_key)
            logger.warning("OTP invalidated after too many attempts for %s", mobile_number)
        return None

    cache.delete(otp_key)
    cache.delete(attempts_key)

    reset_token = secrets.token_urlsafe(32)
    cache.set(
        _TOKEN_KEY.format(mobile=mobile_number),
        reset_token,
        timeout=settings.RESET_TOKEN_TTL_SECONDS,
    )
    return reset_token


def consume_reset_token(mobile_number, reset_token):
    """Validate and invalidate a reset token. Returns True if it was valid."""
    key = _TOKEN_KEY.format(mobile=mobile_number)
    cached = cache.get(key)
    if cached is None or not secrets.compare_digest(str(cached), str(reset_token or '')):
        return False
    cache.delete(key)
    return True

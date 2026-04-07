# app/utils/timezone.py

from datetime import datetime, date
from zoneinfo import ZoneInfo

DEFAULT_TZ = "Asia/Ho_Chi_Minh"


class TimeZoneUtils:
    @staticmethod
    def get_timezone(tz_object) -> ZoneInfo:
        if tz_object is not None:
            if hasattr(tz_object, "timezone") and tz_object.timezone:
                return ZoneInfo(tz_object.timezone)
            elif hasattr(tz_object, "tz") and tz_object.tz:
                return ZoneInfo(tz_object.tz)

        return ZoneInfo(DEFAULT_TZ)

    @staticmethod
    def get_today_for_user(user) -> date:
        tz = TimeZoneUtils.get_timezone(user)
        return datetime.now(tz).date()
from pydantic import EmailStr, GetCoreSchemaHandler
from pydantic_core import core_schema, PydanticCustomError


class LocalizedEmail(str):
    @classmethod
    def __get_pydantic_core_schema__(cls, source, handler: GetCoreSchemaHandler):
        email_schema = handler.generate_schema(EmailStr)

        def wrap_validator(value, handler_):
            try:
                validated = handler_(value)
            except Exception:
                raise PydanticCustomError(
                    "validations.INVALID_EMAIL",
                    "INVALID_EMAIL"
                )
            return str(validated)

        return core_schema.no_info_wrap_validator_function(
            wrap_validator,
            email_schema,
        )
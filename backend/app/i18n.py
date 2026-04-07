import i18n
from pathlib import Path

def configure_i18n():
    BASE_DIR = Path(__file__).parent
    RESOURCES_DIR = str(BASE_DIR / "resources")
    i18n.load_path.append(RESOURCES_DIR)

    # we are using YAML files
    i18n.set("file_format", "yml")
    i18n.set("filename_format", "{namespace}.{locale}.{format}")
    i18n.set("skip_locale_root_data", True)

    # default/fallback locales
    i18n.set("fallback", "en")

    # performance
    i18n.set("enable_memoization", True)
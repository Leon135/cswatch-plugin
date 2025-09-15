import Millennium  # pyright: ignore[reportMissingImports]
from logger import logger


class Plugin:
    def _load(self) -> None:
        try:
            logger.info("cswatch plugin: Starting plugin initialization...")
            Millennium.ready()
            logger.info("cswatch plugin: Plugin loaded successfully")
        except Exception as e:
            logger.error(f"cswatch plugin: Failed to load plugin: {str(e)}")
            raise

    def _front_end_loaded(self) -> None:
        try:
            logger.info("cswatch plugin: Frontend loaded successfully")
            # Add any frontend-specific initialization logic here if needed
        except Exception as e:
            logger.error(
                f"cswatch plugin: Error during frontend load: {str(e)}")

    def _unload(self) -> None:
        try:
            logger.info("cswatch plugin: Plugin unloading...")
            # Add any cleanup logic here if needed
            logger.info("cswatch plugin: Plugin unloaded successfully")
        except Exception as e:
            logger.error(
                f"cswatch plugin: Error during plugin unload: {str(e)}")

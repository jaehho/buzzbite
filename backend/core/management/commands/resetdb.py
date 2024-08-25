import os
import glob
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.conf import settings
import logging
import psycopg2
from psycopg2 import sql

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Clears all migration files, recreates the database, makes migrations, applies them, and loads data from a fixture'

    def handle(self, *args, **kwargs):
        project_root = settings.BASE_DIR
        migration_file_count = 0

        # Database configuration
        db_name = settings.DATABASES['default']['NAME']
        db_user = settings.DATABASES['default']['USER']
        db_password = settings.DATABASES['default']['PASSWORD']
        db_host = settings.DATABASES['default']['HOST']
        db_port = settings.DATABASES['default'].get('PORT', '5432')

        self.stdout.write(self.style.WARNING('Starting to recreate the database...'))

        # Step 1: Recreate the database
        try:
            self._recreate_database(db_name, db_user, db_password, db_host, db_port)
            self.stdout.write(self.style.SUCCESS(f'Database {db_name} recreated successfully.'))
        except Exception as e:
            logger.error(f'Recreating database failed: {e}')
            raise CommandError(f'Recreating database failed: {e}')

        self.stdout.write(self.style.WARNING('Starting to clear migration files...'))

        # Step 2: Clear all migration files
        excluded_apps = getattr(settings, 'EXCLUDED_APPS_FROM_MIGRATION_CLEANUP', [])

        for app in settings.INSTALLED_APPS:
            if app.startswith('django.') or app in excluded_apps:
                continue  # Skip default Django apps and excluded apps

            app_path = os.path.join(project_root, app.replace('.', '/'))
            migration_path = os.path.join(app_path, 'migrations')

            if os.path.isdir(migration_path):
                migration_files = glob.glob(os.path.join(migration_path, '*.py'))
                migration_files = [f for f in migration_files if not f.endswith('__init__.py')]

                if not migration_files:
                    self.stdout.write(self.style.NOTICE(f'No migration files found in {migration_path}'))

                for file in migration_files:
                    try:
                        os.remove(file)
                        self.stdout.write(self.style.SUCCESS(f'Deleted {file}'))
                        migration_file_count += 1
                    except Exception as e:
                        logger.error(f'Could not delete {file}: {e}')
                        self.stderr.write(self.style.ERROR(f'Could not delete {file}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'{migration_file_count} migration files deleted.'))

        # Step 3: Make migrations
        self.stdout.write(self.style.WARNING('Making migrations...'))
        try:
            call_command('makemigrations')
            self.stdout.write(self.style.SUCCESS('Migrations created successfully.'))
        except Exception as e:
            logger.error(f'Making migrations failed: {e}')
            raise CommandError(f'Making migrations failed: {e}')

        # Step 4: Migrate (apply migrations)
        self.stdout.write(self.style.WARNING('Applying migrations...'))
        try:
            call_command('migrate')
            self.stdout.write(self.style.SUCCESS('Migrations applied successfully.'))
        except Exception as e:
            logger.error(f'Applying migrations failed: {e}')
            raise CommandError(f'Applying migrations failed: {e}')

        # Step 5: Load data from a fixture
        fixture_file = getattr(settings, 'FIXTURE_FILE_PATH', 'core/fixtures/initial_data.json')
        self.stdout.write(self.style.WARNING(f'Loading data from fixture: {fixture_file}'))
        try:
            call_command('loaddata', fixture_file)
            self.stdout.write(self.style.SUCCESS(f'Data loaded from fixture {fixture_file} successfully.'))
        except Exception as e:
            logger.error(f'Loading data from fixture failed: {e}')
            raise CommandError(f'Loading data from fixture failed: {e}')

    def _recreate_database(self, db_name, db_user, db_password, db_host, db_port):
        """Drops and recreates the specified database."""
        try:
            # Connect to the default database to run commands
            connection = psycopg2.connect(
                dbname='postgres',
                user=db_user,
                password=db_password,
                host=db_host,
                port=db_port
            )
            connection.set_isolation_level(0)  # Autocommit mode
            cursor = connection.cursor()

            # Drop the database if it exists
            cursor.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(sql.Identifier(db_name)))
            # Recreate the database
            cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))

            cursor.close()
            connection.close()
        except Exception as e:
            logger.error(f'Error recreating database: {e}')
            raise CommandError(f'Error recreating database: {e}')

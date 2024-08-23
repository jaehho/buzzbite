import os
import glob
import subprocess
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

class Command(BaseCommand):
    help = 'Clears all migration files, makes migrations, applies them, and loads data from a fixture'

    def handle(self, *args, **kwargs):
        project_root = settings.BASE_DIR
        migration_file_count = 0

        self.stdout.write(self.style.WARNING('Starting to clear migration files...'))

        # Step 1: Clear all migration files
        for app in settings.INSTALLED_APPS:
            if app.startswith('django.'):
                continue  # Skip default Django apps
            app_path = os.path.join(project_root, app.replace('.', '/'))
            migration_path = os.path.join(app_path, 'migrations')

            if os.path.isdir(migration_path):
                migration_files = glob.glob(os.path.join(migration_path, '*.py'))
                migration_files = [f for f in migration_files if not f.endswith('__init__.py')]

                for file in migration_files:
                    try:
                        os.remove(file)
                        self.stdout.write(self.style.SUCCESS(f'Deleted {file}'))
                        migration_file_count += 1
                    except Exception as e:
                        self.stderr.write(self.style.ERROR(f'Could not delete {file}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'{migration_file_count} migration files deleted.'))

        # Step 2: Make migrations
        self.stdout.write(self.style.WARNING('Making migrations...'))
        try:
            subprocess.check_call(['python', 'manage.py', 'makemigrations'])
            self.stdout.write(self.style.SUCCESS('Migrations created successfully.'))
        except subprocess.CalledProcessError as e:
            raise CommandError(f'Making migrations failed: {e}')

        # Step 3: Migrate (apply migrations)
        self.stdout.write(self.style.WARNING('Applying migrations...'))
        try:
            subprocess.check_call(['python', 'manage.py', 'migrate'])
            self.stdout.write(self.style.SUCCESS('Migrations applied successfully.'))
        except subprocess.CalledProcessError as e:
            raise CommandError(f'Applying migrations failed: {e}')

        # Step 4: Load data from a fixture
        fixture_file = 'core/fixtures/initial_data.json'
        self.stdout.write(self.style.WARNING(f'Loading data from fixture: {fixture_file}'))
        try:
            subprocess.check_call(['python', 'manage.py', 'loaddata', fixture_file])
            self.stdout.write(self.style.SUCCESS(f'Data loaded from fixture {fixture_file} successfully.'))
        except subprocess.CalledProcessError as e:
            raise CommandError(f'Loading data from fixture failed: {e}')

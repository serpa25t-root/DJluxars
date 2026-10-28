from django.db import migrations, models


def restore_user_table(apps, schema_editor):
    connection = schema_editor.connection
    tables = set(connection.introspection.table_names())

    # Older deployments still have the original users_user table and its
    # relations. Keep those records and relations instead of creating an empty
    # users_luxuser table.
    if 'users_user' not in tables:
        if 'users_luxuser' not in tables:
            raise RuntimeError('No se encontró una tabla de usuarios para recuperar.')
        schema_editor.execute('ALTER TABLE users_luxuser RENAME TO users_user')
        tables.remove('users_luxuser')
        tables.add('users_user')

        for old_name, new_name in (
            ('users_luxuser_groups', 'users_user_groups'),
            ('users_luxuser_user_permissions', 'users_user_user_permissions'),
        ):
            if old_name in tables and new_name not in tables:
                schema_editor.execute(f'ALTER TABLE {old_name} RENAME TO {new_name}')
                tables.remove(old_name)
                tables.add(new_name)

    columns = {
        column.name
        for column in connection.introspection.get_table_description(
            connection.cursor(), 'users_user'
        )
    }
    column_definitions = {
        'is_suspended': ('BOOLEAN NOT NULL DEFAULT FALSE', 'BOOLEAN NOT NULL DEFAULT 0'),
        'price': ('INTEGER NOT NULL DEFAULT 0', 'INTEGER NOT NULL DEFAULT 0'),
        'specialty': ("VARCHAR(100) NOT NULL DEFAULT ''", "VARCHAR(100) NOT NULL DEFAULT ''"),
    }

    for column_name, definitions in column_definitions.items():
        if column_name in columns:
            continue
        definition = definitions[0] if connection.vendor == 'postgresql' else definitions[1]
        table = schema_editor.quote_name('users_user')
        column = schema_editor.quote_name(column_name)
        schema_editor.execute(f'ALTER TABLE {table} ADD COLUMN {column} {definition}')


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0002_alter_luxuser_role'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[migrations.RunPython(restore_user_table, migrations.RunPython.noop)],
            state_operations=[
                migrations.AlterModelTable(name='luxuser', table='users_user'),
                migrations.AddField(
                    model_name='luxuser',
                    name='is_suspended',
                    field=models.BooleanField(
                        default=False,
                        help_text='Si está activo, el usuario puede iniciar sesión pero su perfil público muestra "Cuenta suspendida" y no se lista.',
                        verbose_name='cuenta suspendida',
                    ),
                ),
                migrations.AddField(
                    model_name='luxuser',
                    name='price',
                    field=models.PositiveIntegerField(
                        default=0,
                        help_text='Precio base por sesión, fijado por el fotógrafo',
                        verbose_name='tarifa base (COP)',
                    ),
                ),
                migrations.AddField(
                    model_name='luxuser',
                    name='specialty',
                    field=models.CharField(
                        blank=True,
                        help_text='Ej: Retrato, Moda, Eventos (separadas por coma)',
                        max_length=100,
                        verbose_name='especialidad',
                    ),
                ),
            ],
        ),
    ]
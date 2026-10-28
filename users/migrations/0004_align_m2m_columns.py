from django.db import migrations

M2M_TABLES = ('users_user_groups', 'users_user_user_permissions')


def _rename_column(schema_editor, src, dst):
    connection = schema_editor.connection
    tables = set(connection.introspection.table_names())
    cursor = connection.cursor()
    for table in M2M_TABLES:
        if table not in tables:
            continue
        columns = {
            column.name
            for column in connection.introspection.get_table_description(cursor, table)
        }
        if src in columns and dst not in columns:
            quoted_table = schema_editor.quote_name(table)
            quoted_src = schema_editor.quote_name(src)
            quoted_dst = schema_editor.quote_name(dst)
            schema_editor.execute(
                f'ALTER TABLE {quoted_table} RENAME COLUMN {quoted_src} TO {quoted_dst}'
            )


def align_m2m_columns(apps, schema_editor):
    # Esquema legacy: las tablas M2M usan user_id pero el ORM de LuxUser
    # consulta luxuser_id (nombre derivado del model_name), lo que rompía
    # user.delete(), user.groups y user.has_perm() (panel /admin/).
    _rename_column(schema_editor, 'user_id', 'luxuser_id')


def restore_legacy_columns(apps, schema_editor):
    _rename_column(schema_editor, 'luxuser_id', 'user_id')


class Migration(migrations.Migration):
    dependencies = [
        ('users', '0003_restore_legacy_user_table'),
    ]

    operations = [
        migrations.RunPython(align_m2m_columns, restore_legacy_columns),
    ]

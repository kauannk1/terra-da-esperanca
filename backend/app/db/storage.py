from sqlalchemy import text

from app.db.session import engine

STORAGE_BUCKET = "terra-esperanca-arquivos"
ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "application/pdf",
]


def ensure_storage_setup() -> None:
    policy_sql = {
        "Public read terra-esperanca-arquivos": """
            CREATE POLICY "Public read terra-esperanca-arquivos"
            ON storage.objects
            FOR SELECT
            TO anon, authenticated
            USING (bucket_id = 'terra-esperanca-arquivos');
        """,
        "Public insert terra-esperanca-arquivos": """
            CREATE POLICY "Public insert terra-esperanca-arquivos"
            ON storage.objects
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (bucket_id = 'terra-esperanca-arquivos');
        """,
        "Public update terra-esperanca-arquivos": """
            CREATE POLICY "Public update terra-esperanca-arquivos"
            ON storage.objects
            FOR UPDATE
            TO anon, authenticated
            USING (bucket_id = 'terra-esperanca-arquivos')
            WITH CHECK (bucket_id = 'terra-esperanca-arquivos');
        """,
        "Public delete terra-esperanca-arquivos": """
            CREATE POLICY "Public delete terra-esperanca-arquivos"
            ON storage.objects
            FOR DELETE
            TO anon, authenticated
            USING (bucket_id = 'terra-esperanca-arquivos');
        """,
    }

    with engine.begin() as conn:
        conn.execute(
            text(
                """
                INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
                VALUES (:bucket_id, :bucket_name, true, :file_size_limit, :allowed_mime_types)
                ON CONFLICT (id) DO UPDATE
                SET
                    name = EXCLUDED.name,
                    public = EXCLUDED.public,
                    file_size_limit = EXCLUDED.file_size_limit,
                    allowed_mime_types = EXCLUDED.allowed_mime_types,
                    updated_at = now();
                """
            ),
            {
                "bucket_id": STORAGE_BUCKET,
                "bucket_name": STORAGE_BUCKET,
                "file_size_limit": 10 * 1024 * 1024,
                "allowed_mime_types": ALLOWED_MIME_TYPES,
            },
        )

        existing_policies = {
            row[0]
            for row in conn.execute(
                text(
                    """
                    SELECT policyname
                    FROM pg_policies
                    WHERE schemaname = 'storage' AND tablename = 'objects'
                    """
                )
            )
        }

        for policy_name, sql in policy_sql.items():
            if policy_name not in existing_policies:
                conn.execute(text(sql))

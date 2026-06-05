from app.db.base import Base
from app.db.seed import seed_database
from app.db.session import SessionLocal, engine
from app.db.storage import ensure_storage_setup


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_storage_setup()
    with SessionLocal() as db:
        seed_database(db)


if __name__ == "__main__":
    init_db()

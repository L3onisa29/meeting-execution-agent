import os


def main() -> None:
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    print(f"worker bootstrap ok; redis_url={redis_url}")


if __name__ == "__main__":
    main()


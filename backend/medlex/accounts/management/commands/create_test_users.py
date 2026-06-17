"""
Django management command для создания 10 тестовых пользователей.
Не создаёт пользователей повторно если они уже существуют.

Использование:
    python manage.py create_test_users
"""

from django.core.management.base import BaseCommand
from accounts.models import User

TEST_USERS = [
    {
        "email": "aibek.dzhaksybekov@test.kz",
        "name": "Айбек",
        "surname": "Джаксыбеков",
        "phone_number": "+77001111111",
        "organization": "Городская больница №1",
        "specialization": "Кардиология",
        "password": "testpass123",
    },
    {
        "email": "dana.seitkali@test.kz",
        "name": "Дана",
        "surname": "Сейткали",
        "phone_number": "+77002222222",
        "organization": "Республиканская больница",
        "specialization": "Неврология",
        "password": "testpass123",
    },
    {
        "email": "marat.akhmetov@test.kz",
        "name": "Марат",
        "surname": "Ахметов",
        "phone_number": "+77003333333",
        "organization": "Детская больница №3",
        "specialization": "Педиатрия",
        "password": "testpass123",
    },
    {
        "email": "ainur.bekova@test.kz",
        "name": "Айнур",
        "surname": "Бекова",
        "phone_number": "+77004444444",
        "organization": "Онкологический центр",
        "specialization": "Онкология",
        "password": "testpass123",
    },
    {
        "email": "timur.nursultanov@test.kz",
        "name": "Тимур",
        "surname": "Нурсултанов",
        "phone_number": "+77005555555",
        "organization": "Скорая медицинская помощь",
        "specialization": "Скорая помощь",
        "password": "testpass123",
    },
    {
        "email": "gulnara.ospanova@test.kz",
        "name": "Гульнара",
        "surname": "Оспанова",
        "phone_number": "+77006666666",
        "organization": "Психиатрическая больница №1",
        "specialization": "Психиатрия",
        "password": "testpass123",
    },
    {
        "email": "ruslan.karimov@test.kz",
        "name": "Руслан",
        "surname": "Каримов",
        "phone_number": "+77007777777",
        "organization": "Хирургический центр",
        "specialization": "Хирургия",
        "password": "testpass123",
    },
    {
        "email": "zarina.mukhanova@test.kz",
        "name": "Зарина",
        "surname": "Муханова",
        "phone_number": "+77008888888",
        "organization": "Городская поликлиника №5",
        "specialization": "Терапия",
        "password": "testpass123",
    },
    {
        "email": "arman.seilov@test.kz",
        "name": "Арман",
        "surname": "Сейлов",
        "phone_number": "+77009999999",
        "organization": "Травматологический центр",
        "specialization": "Травматология",
        "password": "testpass123",
    },
    {
        "email": "madina.tulegenova@test.kz",
        "name": "Мадина",
        "surname": "Тулегенова",
        "phone_number": "+77000000000",
        "organization": "Перинатальный центр",
        "specialization": "Акушерство и гинекология",
        "password": "testpass123",
    },
]


class Command(BaseCommand):
    help = "Создаёт 10 тестовых пользователей (пропускает уже существующих)"

    def handle(self, *args, **options):
        created_count = 0
        skipped_count = 0

        for data in TEST_USERS:
            if User.objects.filter(email=data["email"]).exists():
                self.stdout.write(f"  Пропущен (уже есть): {data['email']}")
                skipped_count += 1
                continue

            user = User.objects.create_user(
                email=data["email"],
                password=data["password"],
                name=data["name"],
                surname=data["surname"],
                phone_number=data["phone_number"],
                organization=data["organization"],
                specialization=data["specialization"],
            )
            self.stdout.write(f"Создан: {user.email}")
            created_count += 1

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано: {created_count}, пропущено: {skipped_count}."
        ))
        self.stdout.write("")
        self.stdout.write("Тестовые данные для входа:")
        self.stdout.write("  email:    <любой из списка выше>")
        self.stdout.write("  password: testpass123")
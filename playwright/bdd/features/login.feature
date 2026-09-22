# language: ru
Функция: Вход в личный кабинет SauceDemo

  Предыстория:
    Дано открыта страница входа

  @smoke
  Сценарий: Успешный вход с корректными данными
    Когда пользователь входит с логином "standard_user" и паролем "secret_sauce"
    Тогда отображается каталог товаров

  Сценарий: Вход с неверным паролем
    Когда пользователь входит с логином "standard_user" и паролем "wrong-password"
    Тогда отображается ошибка входа "Username and password do not match any user in this service"

  Сценарий: Вход заблокированным пользователем
    Когда пользователь входит с логином "locked_out_user" и паролем "secret_sauce"
    Тогда отображается ошибка входа "Sorry, this user has been locked out."

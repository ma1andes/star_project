from django.urls import path
from .views import (
    register,
    login,
    get_cart,
    get_concert,
    get_product,
    create_concert,
    create_product,
    add_product_in_cart,
    qa,
    get_qa,
    change_concert,
    change_product,
    get_product_detail,
    change_qa,
    create_video,
    get_video_requests,
    update_video_request_status,
    get_me,
    logout,
    get_concerts_for_map,
    get_cities,
    delete_product_in_cart,
)

urlpatterns = [
    # юзер
    path("register", register),
    path("login", login),
    path("me", get_me),
    path("logout", logout),
    # просмотр
    path("concerts", get_concert),
    path("products", get_product),
    path("products/<int:id>", get_product_detail),
    path("cart", get_cart),
    path("cities", get_cities),
    # создание
    path("concert", create_concert),
    path("product", create_product),
    # изменение
    path("concert/<int:id>", change_concert),
    path("product/<int:id>", change_product),
    path("qa/<int:id>", change_qa),
    path("cart/<int:id>", add_product_in_cart),
    path("cart_item/<int:id>", delete_product_in_cart),
    # qa
    path("qa", qa),
    path("qa/vopr", get_qa),
    # video
    path("video-create/", create_video),
    path("video-request/", get_video_requests),
    path("video-update/<int:id>", update_video_request_status),
    path("get-concert-maps/", get_concerts_for_map),
]

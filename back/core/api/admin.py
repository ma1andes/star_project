from django.contrib import admin
from .models import CartModel, CartItemModel
# Register your models here.

admin.site.register(CartModel)
admin.site.register(CartItemModel)
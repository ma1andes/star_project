from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class UserModel(AbstractUser):
    ROLE = {
        'qa':'qa',
        'user':'user',
        'admin': 'admin'
    }
    
    name = models.CharField(max_length=43)
    email = models.EmailField(max_length=43, unique=True)
    role = models.CharField(max_length=43, choices=ROLE)
    username = models.CharField(max_length=43)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'username', 'role']
    
class ConcertModel(models.Model):
    time = models.TimeField(auto_now_add=True)
    title = models.CharField(max_length=43)
    place = models.CharField(max_length=43)
    date = models.DateField(auto_now_add=True)
    
class ProductModel(models.Model):
    TYPE = {
        'school': 'school',
        'dress':'dress'
    }
    
    img = models.ImageField(upload_to='media/%Y/%m/%d/', blank=True, null=True)
    title = models.CharField(max_length=43)
    type = models.CharField(max_length=43, choices=TYPE)
    desc = models.TextField()
    price = models.DecimalField(decimal_places=2, max_digits=10)
    
class CartModel(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    
class CartItemModel(models.Model):
    cart = models.ForeignKey(CartModel, on_delete=models.CASCADE)
    product = models.ForeignKey(ProductModel, on_delete=models.CASCADE)
    
class QAmodel(models.Model):
    STATUS = {
        'on_hold':'on_hold',
        'complete':'complete',
        'in_progress':'in_progress'
    }
    
    comment = models.TextField()
    status = models.CharField(max_length=43, choices=STATUS)
    
class VideoPozdravok(models.Model):
    count = models.PositiveIntegerField(default=0)
    price = models.PositiveIntegerField(default=20000)
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=16)
    age = models.PositiveIntegerField()
    desc = models.TextField()
    hobbies = models.TextField()
    date_birthday = models.DateField()

class VideoRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'В ожидании'),
        ('accepted', 'Принята'),
        ('rejected', 'Отклонена'),
    )

    video = models.ForeignKey(VideoPozdravok, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
from django.db import models
from user.models import CustomUser
from django.utils import timezone
# Create your models here.
class Hashtags(models.Model):
    hashtag=models.CharField(null=True,)

    def __str__(self):
        return self.hashtag

class Posts(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    media=models.FileField(upload_to='media/')
    caption=models.TextField(null=True,default="")
    hashtag=models.ManyToManyField('Hashtags', related_name='posts')
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)


    def __str__(self):
        return self.user.username
    


class Saves(models.Model):
    post=models.ForeignKey(Posts,on_delete=models.CASCADE)
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    time=models.DateTimeField(default=timezone.now,editable=False)

class Likes(models.Model):
    post=models.ForeignKey(Posts,on_delete=models.CASCADE)
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    time=models.DateTimeField(default=timezone.now,editable=False)


class Shares(models.Model):
    post=models.ForeignKey(Posts,on_delete=models.CASCADE)
    sender=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='send')
    reciver=models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='reciver')
    time=models.DateTimeField(default=timezone.now,editable=False)




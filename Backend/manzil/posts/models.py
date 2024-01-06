from django.db import models
from user.models import CustomUser, Professions
from django.utils import timezone

# Create your models here.
class Hashtags(models.Model):
    hashtag=models.CharField(null=True,)

    def __str__(self):
        return self.hashtag

class Posts(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE ,related_name='posts')
    media=models.FileField(upload_to='media/')
    caption=models.TextField(null=True,default="")
    hashtag=models.ManyToManyField('Hashtags', related_name='posts')
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(default=timezone.now, editable=False)


    def __str__(self):
        return self.user.username
    
    def like_count(self):
        return Likes.objects.filter(post=self).count()
    


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




class Requirment(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    profession=models.ForeignKey(Professions,on_delete=models.CASCADE)
    description=models.TextField()
    time=models.DateTimeField(default=timezone.now,editable=False)


class RequirementSaves(models.Model):
    requirement = models.ForeignKey(Requirment, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    time = models.DateTimeField(default=timezone.now, editable=False)


class intrests(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    requirment=models.ForeignKey(Requirment,on_delete=models.CASCADE)
    conformation=models.BooleanField(default=False)
    time=models.DateTimeField(default=timezone.now,editable=False)



class Qustions(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    qustion=models.TextField()


class Answers(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='answers')
    qustion=models.ForeignKey(Qustions,on_delete=models.CASCADE,related_name='answers_to_question')
    answer=models.TextField()
class Ratinganswer(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answers, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()



from django.db import models
from user.models import CustomUser, Professions
from django.utils import timezone

# Create your models here.

class Report(models.Model):
    REPORT_TYPE_CHOICES = (
        ('requirement', 'Requirment'),
        ('question', 'Qustions'),
        ('post', 'Posts'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reported_item_id = models.PositiveIntegerField()
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} reported {self.report_type} - {self.reported_item_id}"


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
    is_blocked=models.BooleanField(default=False)


    def __str__(self):
        return self.user.username
    
    def like_count(self):
        return Likes.objects.filter(post=self).count()
    

    def report_count(self):
        
        return Report.objects.filter(report_type='post', reported_item_id=self.id).count()
    


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
    is_blocked=models.BooleanField(default=False)

    def report_count(self):
        return Report.objects.filter(report_type='requirement', reported_item_id=self.id).count()


class RequirementSaves(models.Model):
    requirement = models.ForeignKey(Requirment, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    time = models.DateTimeField(default=timezone.now, editable=False)


class intrests(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    requirment=models.ForeignKey(Requirment,on_delete=models.CASCADE,related_name="intrested")
    conformation=models.BooleanField(default=False)
    time=models.DateTimeField(default=timezone.now,editable=False)



class Qustions(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    qustion=models.TextField()
    is_blocked=models.BooleanField(default=False)

    def report_count(self):
        return Report.objects.filter(report_type='question', reported_item_id=self.id).count()


class Answers(models.Model):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='answers')
    qustion=models.ForeignKey(Qustions,on_delete=models.CASCADE,related_name='answers_to_question')
    answer=models.TextField()
    is_blocked=models.BooleanField(default=False)

class AnswerReply(models.Model):
    answer = models.ForeignKey(Answers, on_delete=models.CASCADE, related_name='replies')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reply_text = models.TextField()
    parent_reply = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies_to_reply')
    is_blocked=models.BooleanField(default=False)

class Ratinganswer(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answers, on_delete=models.CASCADE,related_name='raitinganswer')
    rating = models.PositiveIntegerField()




class Notification(models.Model):
   NOTIFICATION_TYPES = [
        ('like', 'New Like'),
        ('post', 'New Post'),
        ('follow', 'New Follow'),
        ('message', 'New Message'),
       
    ]
   
   from_user = models.ForeignKey(CustomUser, related_name="notification_from", on_delete=models.CASCADE, null=True)
   to_user = models.ForeignKey(CustomUser, related_name="notification_to", on_delete=models.CASCADE, null=True)
   notification_type = models.CharField(choices=NOTIFICATION_TYPES, max_length=20)
   created = models.DateTimeField(auto_now_add=True)
   is_seen = models.BooleanField(default=False)
   
   def __str__(self):
        return f"{self.from_user} sent a {self.notification_type} notification to {self.to_user}"


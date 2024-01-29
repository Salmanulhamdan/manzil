from django.db import models

# Create your models here.
from django.db import models

from user.models import CustomUser



class ChatRoom(models.Model):
    members = models.ManyToManyField(CustomUser, related_name='chat_rooms')

    def __str__(self):
        return ', '.join([str(member) for member in self.members.all()])

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_seen = models.BooleanField(default=False)

    class Meta:
        ordering = ('timestamp',)

    def __str__(self):
        return f'{self.sender}'
    


class Call(models.Model):
    CALL_TYPE_CHOICES = [
        ('audio', 'Audio Call'),
        ('video', 'Video Call'),
    ]

    STATUS_CHOICES = [
        ('incoming', 'Incoming'),
        ('outgoing', 'Outgoing'),
        ('answered', 'Answered'),
        ('missed', 'Missed'),
    ]

    caller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='outgoing_calls')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='incoming_calls')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    is_answered = models.BooleanField(default=False)
    call_type = models.CharField(max_length=10, choices=CALL_TYPE_CHOICES, default='audio')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='incoming')
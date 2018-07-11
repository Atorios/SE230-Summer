import pika
import time
import json
# ����socketʵ��
connect = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
# ����һ���ܵ�  ��Ȼ��֮ǰ��produce������������һ�ιܵ���
# �����ڲ�֪��produce�еĹܵ��Ƿ�����֮ǰ�����δ����,consumers��Ҳ�������Ļ��ͻᱨ����
# ��consumers��Ҳ����һ����һ����ȷ������
channel = connect.channel()
 
#����queue
channel.queue_declare(queue="test")
 

#�ص�����
def callback(ch, method, properites, body):
    print("-----", ch, method, properites, body)
    print("Received %r" % body)
    answer = json.loads(body)
    print("%s" %answer['id'])
    ch.basic_ack(delivery_tag=method.delivery_tag)  # �ֶ�ȷ���յ���Ϣ������ֶ�ȷ��ʱ��no_ack����ΪFalse,��Ȼ�ͻᱨ��
    
 
channel.basic_qos(prefetch_count=1)  # ����Ϣ����֮ǰ������Ϣ��������
 
channel.basic_consume(callback,
                      queue="requestQueue",
                      no_ack=False)
 
print("Waiting for messages")
#���startֻҪһ��������һֱ���У�����ֹ��һ����������Զ����ȥ��û����Ϣ������߿�ס
channel.start_consuming()

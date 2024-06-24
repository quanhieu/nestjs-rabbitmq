import { connect } from 'amqplib';

class RabbitMQ {
  static connection = null;
  static channel = null;

  static async init(uri) {
    this.connection = await connect(uri);
    this.channel = await this.connection.createConfirmChannel();
    return this.connection;
  }

  static async reconnect(uri) {
    if (this.connection) {
      await this.channel.close();
      await this.connection.close();
      this.connection = null;
    }

    console.log(
      '==================Reconnecting to RabbitMQ=====================',
    );
    return this.init(uri);
  }

  static assertExchange(exchange = 'direct_logs', type = 'direct') {
    return this.channel.assertExchange(exchange, type, {
      durable: true,
    });
  }

  static bindExchange(
    exchangeReceive,
    exchangeSend,
    pattern = '',
    args = null,
  ) {
    return this.channel.bindExchange(
      exchangeReceive,
      exchangeSend,
      pattern,
      args,
    );
  }

  static assertQueue(queue, messageTtl) {
    return this.channel.assertQueue(queue, {
      durable: true,
      // messageTtl,
    });
  }

  static bindQueue(queue, exchange, pattern = '', args = null) {
    return this.channel.bindQueue(queue, exchange, pattern, args);
  }

  static prefetch(numb) {
    return this.channel.prefetch(numb);
  }

  static sendToQueue(queue, content) {
    return this.channel.sendToQueue(queue, Buffer.from(content), {
      persistent: true,
    });
  }

  static publish(
    exchange,
    content,
    routingKey = '',
    priority = undefined,
    expiration,
    callback,
  ) {
    return this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(content),
      {
        priority,
        expiration,
      },
      callback,
    );
  }

  static consume(queue, callback, isNoAck = false) {
    return this.channel.consume(queue, (msg) => callback(msg), {
      noAck: isNoAck,
    });
  }

  // static sendBackAck(message) {
  //   return this.channel.ack(message);
  // }

  static async sendBackAck(message) {
    try {
      if (!this.channel) {
        throw new Error('Channel is not initialized.');
      }
      this.channel.ack(message);
    } catch (error) {
      console.error('Failed to ack message:', error);
    }
  }

  static async closeChannel() {
    await this.channel.close();
  }
}

export default RabbitMQ;

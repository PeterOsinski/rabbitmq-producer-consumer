let q = 'tasks';
let amqp = require('amqp-connection-manager');

let main = async () => {

    var connection = amqp.connect([
        'amqp://localhost:5672',
        'amqp://localhost:5673',
        'amqp://localhost:5674',
    ]);

    var channelWrapper = connection.createChannel({
        json: true,
        setup: function(channel) {
            return channel.assertQueue(q, { durable: true });
        }
    });

    channelWrapper.addSetup(function(channel) {
        return Promise.all([
            channel.consume(q, (msg) => {
                console.log(msg.content.toString())
            }, {noAck: true , exclusive: false })
        ])
    }).catch( e => {
        console.log(e)
    })
}

main()
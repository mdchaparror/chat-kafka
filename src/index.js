const express = require("express");
const path = require("path");
const { Kafka, logLevel } = require("kafkajs/index");
const SocketIO = require("socket.io");
const { emit } = require("process");
const host = "localhost";
const app = express();

//Configuraciones
app.set("port", 3000);
console.log(__dirname);
app.use(express.static(path.join(__dirname, "public")));
const server = app.listen(app.get("port"), () => {
  console.log("Servidor iniciado puerto: ", app.get("port"));
});

const io = SocketIO(server);

const kafka = new Kafka({
  logLevel: logLevel.NOTHING,
  brokers: [`${host}:9092`],
  clientId: "example-consumer",
});

//const topic = 'myTopic'
const consumer = kafka.consumer({ groupId: "test-group" });

const conection = async () => {
  await consumer.connect();
  console.log("Conectado a Kafka");
};
conection().catch((e) => {
  console.error("Se presento un error conectando", e)
});

const subscribe = async (topic) => {
  await consumer.subscribe({ topic, fromBeginning: true });
  io.sockets.emit('OK',{'mensaje':'Suscrito al topic: '+topic})
  console.log("Suscrito al topic: ", topic);
};

const run = async () => {
  console.log("Esperando mensajes");
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Nuevo mensaje: ", message.value.toString());
      io.sockets.emit("mensaje", message.value.toString());
    },
  });
};


//websockect
io.on("connection", (socket) => {
  console.log("Cliente conectado");
  socket.on("subscribe_topic", (topic) => {
    console.log(topic);
    subscribe(topic).catch((e) =>{
      console.error("Se presento un error suscribiendo", e)
      io.sockets.emit('Error',{'mensaje':'Servidor Kafka no iniciado','error':e})
    }

    );
    run().catch((e) => console.error("Se presento un error", e));
  });
});

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const SSLCommerzPayment = require('sslcommerz-lts')
const store_id = "lifeo6673efa4bcdf3";
const store_passwd = "lifeo6673efa4bcdf3@ssl";
const is_live = false;

const app = express();
const port = process.env.PORT || 5000;
console.log(process.env.DB_USER);
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.il352b3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.get("/", (req, res) => {
  res.send("SSL payment Server is available");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.post("/payments", async (req, res) => {
      const totalamount = req.body;
      console.log(totalamount);
      const data = {
        total_amount: 100,
        currency: "BDT",
        tran_id: "REF123", // use unique tran_id for each api call
        success_url: "http://localhost:5000/success-payment",
        fail_url: "http://localhost:5000/fail",
        cancel_url: "http://localhost:5000/cancel",
        ipn_url: "http://localhost:5000/ipn",
        shipping_method: "Courier",
        product_name: "Computer.",
        product_category: "Electronic",
        product_profile: "general",
        cus_name: "Customer Name",
        cus_email: "customer@example.com",
        cus_add1: "Dhaka",
        cus_add2: "Dhaka",
        cus_city: "Dhaka",
        cus_state: "Dhaka",
        cus_postcode: "1000",
        cus_country: "Bangladesh",
        cus_phone: "01711111111",
        cus_fax: "01711111111",
        ship_name: "Customer Name",
        ship_add1: "Dhaka",
        ship_add2: "Dhaka",
        ship_city: "Dhaka",
        ship_state: "Dhaka",
        ship_postcode: 1000,
        ship_country: "Bangladesh",
      };
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send(apiResponse);
        console.log("Redirecting to: ", GatewayPageURL);
      });
    });
    app.post('/success-payment',async(req,res)=>{
        const successData=req.body;
        console.log("Successful payment", successData);
    })
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

run().catch(console.log);

app.listen(port, () => {
  console.log(`SSL payment Server is available on port ${port}`);
});

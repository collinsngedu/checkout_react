import { Box, Button, Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, AppBar, Typography, Toolbar, TextField } from '@mui/material'
import { Frames, CardNumber, ExpiryDate, Cvv } from 'frames-react';
import type { NextPage } from 'next'
import Router from 'next/router'
import React from 'react';
import { useState } from "react";
import { InferGetStaticPropsType } from 'next'

interface paymentdata {
  id: string
  scheme: string
  last4: string

}

export const getStaticProps = async () => {
  const customerId = "cus_2vrd26w4rcgetj3wx3l47kr32i"

  const reqData = { "data": { "customerId": customerId } }

  const res = await fetch("http://localhost:5001/test-7194e/us-central1/getCustomer", {
    method: "POST", body: JSON.stringify(reqData), headers: new Headers({
      'Content-Type': 'application/json'
    })
  });

  console.log(res)

  const resJson = await res.json()


  return {
    props: { paymentList: resJson.result.instruments }
  }

}


function Home({ paymentList }: InferGetStaticPropsType<typeof getStaticProps>) {
  const payments: paymentdata[] = paymentList
  const [paymentMethod, setpaymentMethod] = useState("sofort");
  const [local, setLocal] = useState("de");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [frame, setFrame] = useState(0)
  const paymentMethodChanger = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setpaymentMethod(value)
  }
  const localChanger = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    setLocal(value)
    resetIframe()
  }

  const processIdPayment = async () => {
    const reqData = { "data": { "itemPrice": 300, "insToken": paymentMethod, "customerId": "cus_2vrd26w4rcgetj3wx3l47kr32i" } }
    const res = await fetch("http://localhost:5001/test-7194e/us-central1/processIdPayment", {
      method: "POST", body: JSON.stringify(reqData), headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    const resJson = await res.json()

    if (resJson.result.status == "Pending") {
      location.href = resJson.result.redirectLink
    } else if (resJson.result.status == "Declined") {
      Router.push("/failed")
    }

    else {
      Router.push({ pathname: "/success", query: { token: resJson.result.id } })
    }

  }

  const processCardPayment = async (cardToken: string) => {
    const reqData = { "data": { "itemPrice": 300, "cardToken": cardToken, "cardholderName": name, "email": email } }
    const res = await fetch("http://localhost:5001/test-7194e/us-central1/processCardPayment", {
      method: "POST", body: JSON.stringify(reqData), headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    const resJson = await res.json()

    if (resJson.result.status == "Pending") {
      location.href = resJson.result.redirectLink
    } else if (resJson.result.status == "Declined") {
      Router.push("/failed")
    }

    else {
      Router.push({ pathname: "/success", query: { token: resJson.result.id } })
    }

  }

  const processSofortPayment = async () => {
    const reqData = { "data": { "itemPrice": 300 } }
    const res = await fetch("http://localhost:5001/test-7194e/us-central1/processSofortPayment", {
      method: "POST", body: JSON.stringify(reqData), headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    const resJson = await res.json()

    location.href = resJson.result.redirectLink

  }

  const resetIframe = () => {
    setFrame(frame + 1);
  }



  return (
    <>
      <AppBar position="static" style={{ background: '#8C9E6E' }}>
        <Toolbar >
          <img src="/logo.png" style={{ height: 40, }} alt="my image" />
          <div style={{ width: 16, }}></div>

          <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
            Checkout T-Shirt
          </Typography>
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              value={local}
              onChange={localChanger}
            >
              <FormControlLabel value="de" control={<Radio />} label="De" />
              <FormControlLabel value="uk" control={<Radio />} label="UK" />

            </RadioGroup>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent >
            <div style={{ display: 'flex' }}>
              <div style={{ backgroundColor: "#8C9E6E", height: 56, width: 56 }}></div>
              <div style={{ width: 16 }}></div>
              <div style={{ justifyContent: 'center' }}>
                <Typography>T-Shirt</Typography>
                <Typography>€ 300</Typography>
              </div>

            </div>
          </CardContent>
        </Card>

        <div style={{ height: 16 }}></div>

        <FormControl sx={{ width: 1, }}>
          <FormLabel id="demo-radio-buttons-group-label">Payment Method</FormLabel>
          <RadioGroup
            value={paymentMethod}
            onChange={paymentMethodChanger}
          >
            <FormControlLabel value="sofort" control={<Radio />} label="Sofort" />
            <FormControlLabel value="credit-card" control={<Radio />} label="Credit Card" />
            {
              payments.map(v => (
                <FormControlLabel value={v.id} key={v.id} control={<Radio />} label={v.scheme + " " + v.last4} />
              ))
            }
          </RadioGroup>
        </FormControl>


        {paymentMethod == "credit-card" ?

          <Card style={{ padding: 16 }}>
            <div style={{ display: 'flex', height: 56, }}>
              <Frames key={frame}
                config={{
                  debug: true,
                  publicKey: 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a',
                  localization: local == "de" ? "DE-DE" : "EN-GB",
                  style: {
                    base: {
                      fontSize: '17px',
                    },
                  },

                }}
                cardTokenized={(e) => {
                  alert(e.token);
                  processCardPayment(e.token)
                }}

              >
                <CardNumber />
                <ExpiryDate />
                <Cvv />
              </Frames>

            </div>
            <div style={{ display: 'flex', marginBottom: 16, marginTop: 16 }}>
              <TextField id="standard-basic" label="Cardholder Name" value={name} onChange={evt => setName(evt.target.value)} variant="standard" />
              <div style={{ width: 16 }}></div>
              <TextField id="standard-basic" label="Email" value={email} onChange={evt => setEmail(evt.target.value)} variant="standard" />
            </div>

          </Card>

          : null}

        <div style={{ height: 16 }}></div>

        <Button variant="contained" style={{ backgroundColor: "#8C9E6E" }} onClick={() => {
          if (paymentMethod == "credit-card") {
            Frames.submitCard();
          } else if (paymentMethod == "sofort") {
            processSofortPayment();
          } else {
            processIdPayment()
          }
        }}>Process Payment</Button>

      </Box>

      <script src="https://cdn.checkout.com/js/framesv2.min.js"></script>
    </>
  )
}

export default Home
import { Button, TextField } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";


const SuccessPage: NextPage = () => {
    const router = useRouter()

    const [amount, setAmount] = useState("")

    const refund = async () => {

        try {
            let refundToken

            let refundAmount = Number(amount)

            if (refundAmount == NaN || refundAmount == undefined) {
                throw "The refund should be number"
            }

            if (router.query["token"] != null) {
                refundToken = router.query["token"]
            } else if (router.query["cko-session-id"] != null) {
                refundToken = router.query["cko-session-id"]
            } else {
                throw "token not found"
            }

            if (refundToken != null) {
                const reqData = { "data": { "token": refundToken, amount: refundAmount } }
                const res = await fetch("http://localhost:5001/test-7194e/us-central1/refund", {
                    method: "POST", body: JSON.stringify(reqData), headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
                const resJson = await res.json()

                if (resJson.result.status == "refund_success") {
                    alert("Refund Successfully")
                } else {
                    throw "Request Invaild"
                }
            }
        } catch (err) {
            alert(err)
        }




    }



    return (
        <>
            <h2>Success</h2>

            <div style={{ height: 32 }}></div>

            <div style={{ display: 'flex' }}>
                <TextField id="standard-basic" label="Refund Amount" value={amount} onChange={evt => setAmount(evt.target.value)} variant="standard" />
            </div>

            <div style={{ height: 16 }}></div>

            <Button variant="contained" style={{ backgroundColor: "#8C9E6E" }} onClick={() => {
                refund()
            }}>Process Payment</Button>
        </>
    )
}

export default SuccessPage



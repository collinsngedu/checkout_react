import { Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";

export class AppBar extends React.Component {



    render(): React.ReactNode {
        return (
            <>
                {/* <Button variant="contained" onClick={this.abc}>Process Payment</Button> */}
                {/* <Box sx={{ flexGrow: 1 }}>
                    <AppBar>
                        <Toolbar>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                            >
                            </IconButton>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Checkout Boutique
                            </Typography>
                            {/* <Button color="inherit">Login</Button> */}
                {/* </Toolbar>
                    </AppBar >
                </Box > * /} */}
            </>
        )
    }
}
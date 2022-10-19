import { AppBar, Button, Dialog, IconButton, LinearProgress, Modal, Paper, TextField, Toolbar, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';

function App() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [hasContentEdited, setHasContentEdited] = useState(false)
    const [enabledSaveBtn, setEnabledSaveBtn] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [shortDescription, setShortDescription] = useState('')
    const [email, setEmail] = useState('')
    const [images, setImages] = useState([])
    const [imagesB64, setImagesB64] = useState([])

    const [firstNameError, setFirstNameError] = useState(null)
    const [lastNameError, setLastNameError] = useState(null)
    const [emailError, setEmailError] = useState()

    const modalBoxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 250,
        bgcolor: 'none',
    }

    const validateEmailFormat = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }

    const validateFirstName = () => {
        if(!firstName) {
            setFirstNameError('First Name is Required')
        } else {
            setHasContentEdited(true)
            setFirstNameError(null)
        }
    }

    const validateLastName = () => {
        if(!lastName) {
            setLastNameError('Last Name is Required')
        } else {
            setHasContentEdited(true)
            setLastNameError(null)
        }
    }
    
    const validateEmail = () => {
        if(!email) {
            setEmailError('Email is Required')
        } else if(!validateEmailFormat(email)) {
            setHasContentEdited(true)
            setEmailError('Please enter valid email')
        } else {
            setHasContentEdited(true)
            setEmailError(null)
        }
    }

    useEffect(() => {
        setEnabledSaveBtn(hasContentEdited && !firstNameError && !lastNameError && !emailError)
    }, [firstNameError, lastNameError, emailError])

    const handleSubmit = () => {
        setIsModalOpen(true)
        setTimeout(() => {
            setIsModalOpen(false)
            setIsDialogOpen(true)
        }, 3000);
    }

    const addImages = (imgs) => {
        setImages((oldImgs) => {
            return [...oldImgs, ...imgs]
        })
        for (let i = 0; i < imgs.length; i++) {
            addToB64(imgs[i])
        }
    }

    const addToB64 = (img) => {
        let fileReader = new FileReader()
        fileReader.onloadend = () => {
            setImagesB64((olds) => {
                return [...olds, fileReader.result]
            })
        }
        fileReader.readAsDataURL(img);
    }

    return (
        <div>

            <Modal open={isModalOpen}>
                <Box sx={modalBoxStyle}>
                    <h2 style={{color: "white"}}>Uploading Form</h2> 
                    <LinearProgress/>
                </Box>
            </Modal>

            <Dialog open={isDialogOpen}>
                 <Paper sx={{width: "500px", height: "auto"}}>
                    <AppBar position="static">
                        <Toolbar>
                            <EmailIcon sx={{color: "white"}}></EmailIcon>
                            <Typography  variant="h6" component="div" sx={{ marginLeft: "5px", flexGrow: 1 }}>Email Sent</Typography>
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={() => setIsDialogOpen(false)}
                                aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <div style={{padding: "30px"}}>
                        &#127881; Email is successfully sent, please check you inbox for the form details.
                    </div>
                 </Paper>

            </Dialog>

            <Box sx={{
                justifyContent: "center",
                display: "flex",
                flexWrap: "wrap",
                "& > :not(style)": {
                    m: 1,
                    width: "80%",
                    height: "auto",
                },
            }}>
                <Paper elevation={3} style={{textAlign: "center"}}>
                    <h3><strong>Simple Form</strong></h3>
                    <Grid container spacing={2} sx={{justifyContent: "left", padding: "20px"}}>
                        
                        <Grid item xs={6}>
                            <TextField 
                                id="outlined-basic" fullWidth label="First Name" variant="outlined" value={firstName} 
                                error={!!firstNameError} helperText={firstNameError} onChange={(e) => {setFirstName(e.target.value)}} onBlur={() => validateFirstName()} />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField 
                                id="outlined-basic" fullWidth label="Last Name" variant="outlined" value={lastName}
                                error={!!lastNameError} helperText={lastNameError} onChange={(e) => {setLastName(e.target.value)}} onBlur={() => validateLastName()} />
                        </Grid>

                        <Grid item xs={12} sx={{marginTop: "30px"}}>
                            <TextField 
                                id="outlined-basic" fullWidth multiline rows={4} label="Small Description" variant="outlined" value={shortDescription} 
                                onChange={(e) => setShortDescription(e.target.value)}  />
                        </Grid>

                        <Grid item xs={12} sx={{marginTop: "30px"}}>
                            <TextField 
                                id="outlined-basic" fullWidth label="Email" variant="outlined" value={email} 
                                error={!!emailError} helperText={emailError} onChange={(e) => {setEmail(e.target.value); validateEmail();}} onBlur={() => validateEmail()} />
                        </Grid>

                        {
                            (imagesB64.map((img, index) =>  {
                                return (<Grid key={index} item xs={6}>
                                    <img src={img} style={{width: "100%"}}/>
                                </Grid>)
                            }) )
                        }

                        <Grid item xs={12} sx={{marginTop: "30px"}}>
                            <div style={{textAlign:"right"}}>
                                <Button variant="text" startIcon={<AddIcon/>} style={{marginRight: "5px", color: "black"}}  component="label" >
                                    Add Image
                                    <input hidden accept="image/*" multiple type="file" onChange={(e) => addImages(e.target.files)} value=""/>
                                </Button>
                                <Button variant="contained" disabled={!enabledSaveBtn} onClick={() => handleSubmit()}>Save</Button>
                            </div>
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </div>

    );
}

export default App;

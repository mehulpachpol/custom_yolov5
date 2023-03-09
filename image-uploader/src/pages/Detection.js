import {React, useEffect, useState} from 'react'
import axios from 'axios';
import SplitPane, { Pane } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css'
import bolt from '../bolt.jpg';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Loadbutton from '../components/Loadbutton';

function Detection() {
    const BASE_URL = 'http://localhost:5000/';

    const [sizes, setSizes] = useState([550, 'auto']);
    const [sizes1, setSizes1] = useState([350, 'auto']);
    const [sizes2, setSizes2] = useState([275, 'auto']);
    const [sizes3, setSizes3] = useState([150, 'auto']);
    const [sizes4, setSizes4] = useState([850, 'auto']);
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [isloading ,setLoading] = useState(false);
    const [detected ,setDetected] = useState(false);
    const [current, setCurrent] = useState(1);
    const [labeltxt, setLabeltxt] = useState('')
    const [currClasses, setCurrClasses] = useState([])

    const layoutCSS = {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const selectFiles = (event) => {
    	let images = [];
    	for (var i = 0; i < event.target.files.length; i++) {
            images[i] = event.target.files.item(i);
        }
        images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
        let message = `${images.length} valid image(s) selected`
        setMessage(message)
        setImages(images)
    }

    const uploadImages = (e) => {
    	const uploaders = images.map(image => {
		    const data = new FormData();
		    data.append("image", image, 'detect' + image.name);
		    
	    	// Make an AJAX upload request using Axios
	    	return axios.post(BASE_URL + 'upload', data)
	    	.then(response => {
                deleteExp()
                console.log(response.data.imageUrl)
				setImageUrls([response.data.imageUrl, ...imageUrls]);
			})
		});

	 	// Once all the files are uploaded 
		axios.all(uploaders).then(() => {
			console.log('done uploading');
		}).catch(err => alert(err.message));
    }

    const deleteImages = () =>{
		console.log("Started deleting")
		const a = axios.get(BASE_URL + 'deletedetect')
		// listReactFiles(this.state.directory).then(files => console.log(files))
		a.then(function (response) {
			console.log(response.data);})
		return a
	}

    const deleteExp = () =>{
		console.log("Started deleting")
		const a = axios.get(BASE_URL + 'deleteexp')
		// listReactFiles(this.state.directory).then(files => console.log(files))
		a.then(function (response) {
			console.log(response.data);})
		return a
	}

    const DetectPy = (e) => {
        setDetected(false)
        e.preventDefault()
        test()
        console.log("Python triggered")
        const a = axios.get(BASE_URL + 'detectimg')
        a.then(function (response) {
          console.log(response);
        })
        return a
    }

    const test = () => {
        setLoading(true) 
        console.log("Here")
        const a = axios.get(BASE_URL + 'piddetect')
        a.then((response)=>  {
          console.log(response.data);
          setLoading(false)
          setDetected(true)
          f = true
        })
        return a
    }

    function importAll(r) {
        return r.keys().map(r);
    }
      
    const [allImages, setAllImages] = useState([])
    const [allLabels, setAllLabels] = useState([])

    useEffect(() => {
        setAllImages(importAll(require.context('../../../yolov5/runs/detect/exp', false, /\.(png|jpe?g|svg)$/)))
        setAllLabels(importAll(require.context('../../../yolov5/runs/detect/exp/labels', false, /\.(txt)$/)))
    }, [detected])

    useEffect(() => {
        console.log(allImages)
        console.log(allLabels)
        showFile()
    }, [allImages, allLabels, current])

    const myStatusFormatter = (currentItem, total) => {
        setCurrent(currentItem)
        console.log(currentItem)
        return currentItem + ' of ' + total
    }

    const showFile = async () => {
        fetch(allLabels[current-1])
        .then(r => r.text())
        .then(text => {
            // console.log('text decoded:', text);
            // setLabeltxt(text)
            readlabel(text)
        });
    }

    const classes = ['nut', 'bolt', 'threads', 'rust', 'hole', 'cat', 'dog', 'pig', 'horse', 'lion', 'lyon']
    const readlabel = (text) => {
        let arr = []
        let currclasses = []
        let lines = text.split('\n'); // split the string into an array of lines
        for (let i = 0; i < lines.length-1; i++) {
            const firstWord = lines[i].split(' ')[0];
            arr.push(parseInt(firstWord))
            currclasses.push(classes[parseInt(firstWord)])
        }
        const uniqueArray = [...new Set(arr)];
        setCurrClasses([...new Set(currclasses)]);
        console.log(uniqueArray)
    }

    // useEffect(()=>{
    //     readlabel()
    // }, [current])

    return (
        <div style={{ height: "100vh", "width": "100vw" }}>
            <SplitPane
                split="horizontal"
                sizes={sizes}
            >
                <SplitPane sizes={sizes1}>
                    <SplitPane split="horizontal" sizes={sizes2}>
                        <div style={{ ...layoutCSS, background: '#ddd', "display":"flex"}}>
                            <div><h4>List of all defects detected in the image</h4></div>
                            <ul>
                            {
                                currClasses.map((element) => {
                                    return(
                                        <li style={{"fontSize":"1.5rem"}}>{element}</li>
                                    )
                                })
                            }
                            </ul>
                        </div>
                        <div style={{ ...layoutCSS, background: '#d5d7d9' }}>
                            Defect description by selecting item in above pane
                        </div>
                    </SplitPane>
                    <SplitPane split="horizontal" sizes={sizes3}>
                        <div style={{ ...layoutCSS, background: '#bbb' }}>
                            What we are detecting (Checkboxes)
                        </div>
                        <SplitPane split="vertical" sizes={sizes4}>
                            <div style={{ ...layoutCSS, background: '#eee' }}>
                            <Carousel showThumbs={false} statusFormatter={(currentItem, total)=>myStatusFormatter(currentItem, total)}>
                                {
                                    allImages.map((ele)=>{
                                        return(
                                            <div key={ele}>
                                                {/* <img src={ele} style={{"maxWidth":"850px", "maxHeight":"400px", "width": "auto", "height": "auto"}}/> */}
                                                <img src={ele} style={{"height": "400px"}}/>
                                            </div>
                                        )
                                    })
                                }
                                {/* <div>
                                    <img src="assets/3.jpeg" />
                                    <p className="legend">Legend 3</p>
                                </div> */}
                            </Carousel>
                            </div>
                            <div style={{ ...layoutCSS, background: '#ccc' }}>
                                <div className="col-sm-12">
                                    <h1>Upload Image for Detection</h1><hr/>
                                    <div>
                                        <input className="form-control" style={{"background":"#ccc"}} type="file" onChange={selectFiles} multiple/>
                                    </div>
                                    { message? <p className="text-info">{message}</p>: ''}
                                    <br/><br/><br/>
                                    <div className="col-sm-3">
                                        <button className="btn btn-primary" value="Submit" onClick={uploadImages}>Upload</button>
                                    </div>
                                    <div className="col-sm-3">
                                        {
                                            !isloading && <button className="btn btn-success" value="Submit" onClick={DetectPy}>Detect</button>
                                        }
                                        {
                                            isloading && <Loadbutton btn={"Detecting..."} color={"success"}/>
                                        }
                                    </div>
                                    <div className="col-sm-3">
                                        <button className="btn btn-danger" onClick={deleteImages}>Reset</button>
                                    </div>
                                </div>
                            </div>
                        </SplitPane>
                    </SplitPane>
                </SplitPane>
                <Pane minSize={"100%"}>
                    <div style={{ ...layoutCSS, background: '#aaa' }}>
                        Quality statistics for entire batch
                    </div>
                </Pane>
            </SplitPane>
        </div>
    );
}

export default Detection
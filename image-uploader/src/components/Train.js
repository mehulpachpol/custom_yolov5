import React, { useState } from 'react';
import axios from 'axios';
import Loadbutton from './Loadbutton';

const BASE_URL = 'http://localhost:5000/';

const Train=(props)=> {
    const [batchsize ,setBatchSize] = useState();
    const [epoch ,setEpoch] = useState();
    const [imagesize ,setImageSize] = useState();

    const [scale ,setScale] = useState();
    const [momentum ,setMomentum] = useState();
    const [degree ,setDegree] = useState();
    const [rate ,setRate] = useState();

    const [isloading ,setLoading] = useState(props.isloading);

    const handleBatch = (e) =>{
        setBatchSize(e.target.value)
    }

    const handleImage = (e) =>{
      setImageSize(e.target.value)
    }

    const handleEpoch = (e) =>{
        setEpoch(e.target.value)
    }

    const handleRate = (e) =>{
        setRate(e.target.value)
    }

    const handleScale = (e) =>{
    	setScale(e.target.value)
    }

    const handleDegree = (e) =>{
    	setDegree(e.target.value)
    }

    const handleMomentum = (e) =>{
    	setMomentum(e.target.value)
    }

    const handleTrain = (e) =>{
        e.preventDefault()
        console.log(epoch)
        console.log(batchsize)
        console.log(imagesize)
    }

    const showPy = (e) => {
		e.preventDefault()
		test();
		console.log("Python triggered")
		const a = axios.get(BASE_URL + 'name',
			{
				headers: {
					'batchsize': batchsize,
					'epochs': epoch,
					'image' : imagesize,
					"rate"  : rate,
					"scale" : scale,
					"degree" : degree ,
					"momentum" : momentum
				}
			}
      	)
		// listReactFiles(this.state.directory).then(files => console.log(files))
		a.then(function (response) {
			console.log(response);})
		return a
    }

    const test = () =>{
		setLoading(true) 
		console.log("oye ye ")
		const a = axios.get(BASE_URL + 'pid')
		
		a.then((response)=>  {
			console.log(response.data);
			setLoading(false) 
		})
		
		return a
    }


    // const fetchQuotes = async () => {
    //   const res = await axios.get(
    //     `https://famous-quotes4.p.rapidapi.com/random`,
    //     {
    //       headers: {
    //         'x-rapidapi-host': 'famous-quotes4.p.rapidapi.com',
    //         'x-rapidapi-key': API_KEY
    //       }
    //     }
    //   );
    //   return res.data;
    // };

//     const showPy = async() => {
//       try {

//           console.log("Python triggered")
//           const url = "http://localhost:5000/name"
//           const response = await fetch(url, {
//               method: 'GET', 
//               headers: {
//                   'Content-Type': 'application/json',
//                   'accept':'application/json',
//                   'batchsize': batchsize,
//                   'epochs': epochs,
//                   'image' : imagesize 
//               }
//           });
//       } catch(error) {
//           console.log(error)
//         }
//     }

  return (
    <div className='container'>
      <form>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label ">Batch Size</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" onChange={handleBatch} />
          </div>
        </div>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label">Epochs</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" onChange={handleEpoch} />
          </div>
        </div>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label">Image Size</label>
          <div className="col-sm-10">
            <input type="number" className="form-control"  onChange={handleImage}/>
          </div>
        </div>
        <h1>Advanced Feature</h1>
        <h2>Set Hyperparameters</h2>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label ">Learning Rate</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" onChange={handleRate} />
          </div>
        </div>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label ">Momentum</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" onChange={handleMomentum} />
          </div>
        </div>
        <h1>Data Augmentation</h1>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label ">Scale</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" onChange={handleScale} />
          </div>
        </div>
        <div className="row mb-3 my-3">
          <label className="col-sm-2 col-form-label ">Degrees</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" onChange={handleDegree} />
          </div>
        </div>
        {!isloading && <button type="submit" className="btn btn-primary" onClick={showPy}>Train</button>}
        {isloading && <Loadbutton btn={"Training..."} color={"primary"}/>}
      </form>
    </div>
  )
};

export default Train;


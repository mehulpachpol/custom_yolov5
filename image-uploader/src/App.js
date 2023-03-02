import React, { Component } from 'react';
import axios from 'axios';
import Loading from './Loading';
import Train from './Train';


import Temp from './Temp';

// import listReactFiles from 'list-react-files'
const BASE_URL = 'http://localhost:5000/';




class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        	images: [],
        	imageUrls: [],
        	message: '',
			uploadingCharityImages : false,
			progressCharityImages : 0,
			directory : "public/images/uploads",
			isloading : false
			

        }
    }





    selectFiles = (event) => {
    	let images = [];
    	for (var i = 0; i < event.target.files.length; i++) {
            images[i] = event.target.files.item(i);
        }
        images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
        let message = `${images.length} valid image(s) selected`
        this.setState({ images, message })
    }

    uploadImages = () => {
    
    	const uploaders = this.state.images.map(image => {
		    const data = new FormData();
		    data.append("image", image, image.name);
		    
	    	// Make an AJAX upload request using Axios
	    	return axios.post(BASE_URL + 'upload', data)
	    	.then(response => {
				this.setState({imageUrl: [response.data.imageUrls, ...this.state.imageUrls]});
			})
		});

	 	// Once all the files are uploaded 
		axios.all(uploaders).then(() => {
			console.log('done');
		}).catch(err => alert(err.message));

    }

	deleteImages = () =>{
		console.log("oye ye kya kar rah ahai tu")
		const a = axios.get(BASE_URL + 'delete')
		// listReactFiles(this.state.directory).then(files => console.log(files))
		a.then(function (response) {
			console.log(response.data);})
		return a

	}

	test = () =>{
		this.setState({isloading : true}) 
		console.log("oye ye ")
		const a = axios.get(BASE_URL + 'pid')
		
		a.then((response)=>  {
			console.log(response.data);
			this.setState({isloading : false}) 
		})
			
		return a

	}



	
	
	

    render() {
        return (
        	<div>

			{
                
                <Loading 
                    // uploadingCharityImages={this.state.uploadingCharityImages}
                    
                />
            }


	        	<br/>
	        	<div className="col-sm-12">
        			<h1>Upload Train Data</h1><hr/>
	        		<div className="col-sm-4">
		        		<input className="form-control " type="file" onChange={this.selectFiles} multiple/>
		        	</div>
		        	{ this.state.message? <p className="text-info">{this.state.message}</p>: ''}
		        	<br/><br/><br/>
		        	<div className="col-sm-4">
		            	<button className="btn btn-primary" value="Submit" onClick={this.uploadImages}>Submit</button>
		        	</div>
					<div className="col-sm-4">
		            	<button className="btn btn-success"  onClick={this.deleteImages}>Reset</button>
		        	</div>
	            </div>
	            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><hr/><br/>
	            <div className="row col-lg-12">
		        	{ 
			          	this.state.imageUrls.map((url, i) => (
				          		<div className="col-lg-2" key={i}>
				          			<img src={BASE_URL + url} className="img-rounded img-responsive" alt="not available"/><br/>
				          		</div>
				          	))
			        }
		        </div>


				<br/>
	        	<div className="col-sm-12">
        			<h1>Upload Validation Data</h1><hr/>
	        		<div className="col-sm-4">
		        		<input className="form-control " type="file" onChange={this.selectFiles} multiple/>
		        	</div>
		        	{ this.state.message? <p className="text-info">{this.state.message}</p>: ''}
		        	<br/><br/><br/>
		        	<div className="col-sm-4">
		            	<button className="btn btn-primary" value="Submit" onClick={this.uploadImages}>Submit</button>
		        	</div>
					<div className="col-sm-4">
		            	<button className="btn btn-success"  onClick={this.deleteImages}>Reset</button>
		        	</div>
	            </div>
	            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><hr/><br/>
	            <div className="row col-lg-12">
		        	{ 
			          	this.state.imageUrls.map((url, i) => (
				          		<div className="col-lg-2" key={i}>
				          			<img src={BASE_URL + url} className="img-rounded img-responsive" alt="not available"/><br/>
				          		</div>
				          	))
			        }
		        </div>

				<br/>
	        	<div className="col-sm-12">
        			<h1>Upload Test Data</h1><hr/>
	        		<div className="col-sm-4">
		        		<input className="form-control " type="file" onChange={this.selectFiles} multiple/>
		        	</div>
		        	{ this.state.message? <p className="text-info">{this.state.message}</p>: ''}
		        	<br/><br/><br/>
		        	<div className="col-sm-4">
		            	<button className="btn btn-primary" value="Submit" onClick={this.uploadImages}>Submit</button>
		        	</div>
					<div className="col-sm-4">
		            	<button className="btn btn-success"  onClick={this.deleteImages}>Reset</button>
		        	</div>
					{/* <div className="col-sm-4">
		            	<button className="btn btn-success"  onClick={this.test}>Test</button>
		        	</div> */}
	            </div>
	            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><hr/><br/>
	            <div className="row col-lg-12">
		        	{ 
			          	this.state.imageUrls.map((url, i) => (
				          		<div className="col-lg-2" key={i}>
				          			<img src={BASE_URL + url} className="img-rounded img-responsive" alt="not available"/><br/>
				          		</div>
				          	))
			        }
		        </div>


				<Train isloading = {this.state.isloading}/>
			
				
		    </div>
        );
    }
}

export default App; 			
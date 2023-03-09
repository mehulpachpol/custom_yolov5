import React from 'react'
import { Button, Spinner } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
class App extends React.Component{
    render(){
        return(
            <div>
                <Button variant="primary" disabled>
                    <Spinner
                    as="span"
                    variant="warning"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    animation="border"/>
                      {this.props.btn}
                </Button>
            </div>
        )
    }
    
}
export default App;

//Hello bro
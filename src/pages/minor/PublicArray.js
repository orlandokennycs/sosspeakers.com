import React from 'react'
import { loadStripe } from '@stripe/stripe-js';
import Select from 'react-select';
import Collapsible from 'react-collapsible';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './collapsible.scss'; 
import Switch from "react-switch";
const SOSLineup = require('../media/SOSLineup.png')


const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);
var pricesDict = []
const items = []
var uniqueSpeakers = []
const allSpeakers = []
const speakerSelector = []
const pillButtons = []


class PublicArray extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      errorMessages: [],
      sessioniId: null,
      selectedOption: null,
      price: null,
      inventory: [],
      isDoneFetching: false,
      oneTimeFlag: false,
    
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)  //handleChange from plug-in to poortable selection... this changes the price and BUYNOW feature. 
    this.handleSpeakerChange = this.handleSpeakerChange.bind(this)
  }
  
  returnPrice = (priceId) => {
    for(var i = 0; i < (this.state.inventory).length; i++)
    {
      for(var j = 0; j < (this.state.inventory[i]).length; j++)
      {
        if(String(this.state.inventory[i][j][0]) === String(priceId))
        {
          var first = this.state.inventory[i][0]
          var current = this.state.inventory[i][j]
          var copy = this.state.inventory

          copy[i][0] = current
          copy[i][j] = first

          this.setState({inventory: copy})
        }
      }
    }
  }

  handleChange = (index, productId, priceAmount, label) => {
    var id=index + ":" + label
    var allPillButtons = document.getElementsByClassName('pillButton')
    

    for(var x = 0; x < allPillButtons.length; x++)
    {
      // eslint-disable-next-line
      if((allPillButtons[x].id).includes(index + ":"))
      {
        //console.log(allPillButtons[x].id)
        if(allPillButtons[x].id == id)
        {
          allPillButtons[x].style.color = 'white'
          allPillButtons[x].style.backgroundColor = '#9e84ae'
        }
        else
        {
          allPillButtons[x].style.color = '#9e84ae'
          allPillButtons[x].style.backgroundColor = 'white'
        }
      }
        
      /*if(allPillButtons[x].id == id)
      {
        alert(allPillButtons[x].id)
      }*/
    }
    //it changes only the productID and price amount
    items[index][5] = productId
    items[index][6] = priceAmount
    
    this.returnPrice(productId)
    
  }

  handleSpeakerChange = (unqSpeakerId) => {
    
    var allSpeakerDivs = document.getElementsByClassName('speaker')

    for(var x = 0; x < allSpeakerDivs.length; x++)
    {
      // eslint-disable-next-line
      if(allSpeakerDivs[x].id == unqSpeakerId)
      {
        allSpeakerDivs[x].style.display = 'block'
      }
      else
      {
        allSpeakerDivs[x].style.display = 'none'
      }
    }
    
  }

  componentDidMount()
  {
    let self = this
    fetch(`/.netlify/functions/allProducts`).then(function(response) {
      return response.json();
      }).then(function(responseJson) {
        self.setState({items: JSON.stringify(responseJson)})
        
        var finArr = []
        
        for(var x = 0; x < responseJson.length; x++)
        {
          var arr = []
          for (var key in responseJson[x].LINKS) {
            var right = (String(Object.values(responseJson[x].LINKS[key]))).split(',')
            arr.push([[right[1]], right[2]])
          }
          finArr.push(arr)
        }
        
        self.setState({inventory: finArr})
      });
      this.setState({isDoneFetching: true})
      
    }
    //pass in product id and search for it in item
    
    //DO NOT TOUCH, this handles checkout through your backend 
    async handleClick(index) {
      var buyItem = items[index][5]
      const stripe = await stripePromise
     fetch("/.netlify/functions/productCheckout", {
      method: "POST", 
      body: buyItem
    }).then(function(response) {
      return response.json();
      }).then(function(responseJson) {
        const sessionId = responseJson.session.id;
        stripe.redirectToCheckout({sessionId: sessionId})
      });
    }
    //DO NOT TOUCH

  render() {
    var tempList = []
    
    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      fade: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      className: "slides",
      
    };


    if((this.state.items != null) && (this.state.isDoneFetching) && (!(this.state.oneTimeFlag)))
    {
      var parsedObj = JSON.parse(this.state.items)

      
      for(const [index, value] of parsedObj.entries())
      {

        var name= (<h1 className="name" key={index}>{value.NAME}</h1>)
        
        allSpeakers.push(value.NAME)
        
        var img =
            <Slider {...settings}>
                <div>
                    {<img className="prodImg" src={(value.PICS)[0]} alt="product"></img>}
                </div>
                <div>         
                    {<img className="prodImg" src={(value.PICS)[1]} alt="product"></img>}
                </div>
                <div>         
                    {<img className="prodImg" src={(value.PICS)[2]} alt="product"></img>}
                </div>
                <div>
                    {<img className="prodImg" src={value.PHOTO} alt="product"></img>}
                </div>
            </Slider>
            
            
        var desc = <div><Collapsible key={index} open={true} triggerDisabled={true} triggerStyle={{display: 'none', padding: '15px'}} contentInnerClassName="Collapsible__contentInner" trigger="">
          
          {value.DESCRIPTION}
          <br></br>
          <br></br>
          Features:
          <br></br>
          <ul>
            <li className="list">- Bluetooth 5.0</li>
            <br></br>
            <li className="list">- 12 Hour Battery Life (Portable Version Only)</li>
            <br></br>
            <li className="list">- 3'' HiFi Full-Range Speakers</li>
            <br></br>
            <li className="list">- Polyurethane-coated Birch plywood encasing</li>
          </ul>
          <p>Due to the handmade nature of this product it is non-refundable.</p>
          
          
          </Collapsible>
          <h2 className="description">
          Dimensions: <br></br>
          11" x 7" x 7" <br></br><br></br>
          
          <b>Ships in three weeks.</b>
          </h2>
          </div>
        
        var dropList = []
        for(var i = 0; i < (value.LINKS).length; i++)
        {
          for(var key in value.LINKS[i])
          {
            //0 index is ALWAYS product id
            //1 index is ALWAYS price id
            //2 index is ALWAYS price
            pricesDict.push({[value.LINKS[i][key][1]]: value.LINKS[i][key][2]})
            dropList.push({value: value.LINKS[i][key][1], label: key, price: value.LINKS[i][key][2]})
          }  
        }
        /*var select = <Select 
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
            ...theme.colors,
              text: 'orangered',
              primary25: 'gray',
              primary: '#9e84ae ',
            },
          })}    
          className="select" defaultValue={dropList[0]} isSearchable={false} onChange={(e) => this.handleChange(index, e.value, e.price)} options={dropList}></Select>*/

        var select = (dropList.map((option) => <button className="pillButton" id={index + ":" + option.label} style={option.label == dropList[0].label ? {backgroundColor: '#9e84ae', color: 'white'} : {}} onClick={(e) => this.handleChange(index, option.value, option.price, option.label)}>{option.label}<br></br><b className="buttonPrice">${option.price}</b></button>))
        var buyNow = <button className="buyNow" onClick={e => this.handleClick(index)}><center>Buy Now</center></button>
        items.push([img, name, desc, select, buyNow, dropList[0].value])
        
        
      }
      
      this.setState({oneTimeFlag: true})


      for(var x = 0; x < allSpeakers.length; x++)
      {
        tempList.push({value: allSpeakers[x], label: allSpeakers[x], speakerId: x})
      }
      
      uniqueSpeakers = tempList

      speakerSelector.push(<Select 
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
            ...theme.colors,
              primary25: 'gray',
              primary: '#9e84ae ',
            },
          })}    
          className="selectSpeaker" defaultValue={uniqueSpeakers[0]} isSearchable={false} onChange={(e) => this.handleSpeakerChange(e.speakerId)} options={uniqueSpeakers} ></Select>)

    }

    /*INITIALLY HIDE ALL CARDS*/

    return (
      <div className="centerDivSpeakers">
        
        {this.state.isDoneFetching && <div>{/*larger array thatll load one speaker view at a time*/}
        
        <center><h1 className="name">SOS SEASON 2</h1><Collapsible  open={false} triggerClassName="Collapsible__triggerLineup" contentInnerClassName="Collapsible__contentInnerLineup" trigger="LINEUP" ><img src={SOSLineup}></img></Collapsible><h1 className="name">MODELS:</h1></center>
        
        
        
        
        {speakerSelector[0]}

        
          {/*uniqueSpeakers.map((index) => <div>dsfas{uniqueSpeakers[index].value}</div>)*/}
       
        
       {this.state.inventory.map((price, index) =>
       //correctly sets it individually to the first value
       // eslint-disable-next-line
      <div className='speaker' id={index} style={index == 0 ? {display: 'block'} : {display:'none'}}> {/*style={{display: 'none' }} style={{display: { this.state.showStore ? 'block' : 'none'} }}*/}

          <div className="outline">
              <center>{items[index][0]}{items[index][3]}</center>
              
              
              {items[index][2]}
              
               {/*} <h2 className="method">Style + Transportation:</h2>
                {items[index][3]}
              
       <br></br>*/}
              
              {/*h2 className="total">TOTAL:</h2>*/}
       <h1 className="price">${price[0][1]}</h1>
              {items[index][4]}
            </div>
          
            <br></br>
            <br></br>
            
        </div>
          
          
       )}
       </div>}
      </div>
    )
  }
}
export default PublicArray
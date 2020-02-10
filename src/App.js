import React , { useState, useEffect, Fragment } from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon, popup } from 'leaflet';
import "./app.css";
import axios from 'axios';


function App() {

  //state principal
  const [ ubicacion, guardarUbicacion ] = useState([]);

  const [ latitude, guardarlatitude ] = useState('');
  const [ longitude, guardarlongitude ] = useState('');

  const icon = new Icon({
    iconUrl: '/iconocarne.png.png',
    iconSize: [25, 25]
  });

  const [ubicacionActiva, guardarUbicacionActiva] = useState(null);

  useEffect( () => {
    const consultarAPI = async () => {

      //trae las etiquetas, las categorias de cada negocio
      //"http://tarjetafamilia.catamarca.gob.ar/api/v1/commerce-tags/"
     
      const url = 'https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/';
      const resultado = await axios.get(url);
      guardarUbicacion(resultado.data.data); //genera multiples consultas generando un bucle infinito


      guardarlatitude(resultado.data.data[13].attributes.point.coordinates[1])
      guardarlongitude(resultado.data.data[13].attributes.point.coordinates[0])

    
      //otra forma de obtener la respuesta de la API comerce
      // const url = 'https://tarjetafamilia.catamarca.gob.ar/api/v1/commerce/';
      // const respuesta = await fetch(url);
      // const resultado = await respuesta.json();
 
      // guardarUbicacion(resultado.data);
    }
    consultarAPI();
  },[]);

 
  return (

    <Fragment>

      <h1> MAPP </h1>
      {/* mostrar el mapa "Map" pasando "center" y "zoom" */}
      <div className="mapaCentrado">
        <Map center={[-28.468248, -65.778944]} zoom={13}>
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            { ubicacion.map( comercio => (
              <Marker 
                key={comercio.id}
                position={[latitude, longitude]}
                icon={icon}
                onclick= {() => {
                  guardarUbicacionActiva(comercio);
                }} 
              />
            ))}

              {ubicacionActiva && 
                <Popup 
                  position= {[latitude, longitude]}
                  onClose={() => {
                    guardarUbicacionActiva(null);
                  }} 
                > 
                  <div>
                    {ubicacionActiva.attributes.name}
                  </div>

                </Popup>
              }
            
        </Map>  
      </div>

    </Fragment>

  );
}

export default App;

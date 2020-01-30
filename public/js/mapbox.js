/*eslint-disable*/



export const displayMap =(locations)=>{
    mapboxgl.accessToken = 'pk.eyJ1Ijoiczk2dmlzaGFsIiwiYSI6ImNrNWxhaTJyNDA5dmQzZHJ3dW9ucWhhc24ifQ.J7huWePoSCLqTvxuXSD7YQ';

    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/s96vishal/ck5laqnz40wu41iodke9myow5',
        scrollZoom:false
    });
    
    const bounds =new mapboxgl.LngLatBounds();
    
    locations.forEach(loc =>{
        const el = document.createElement('div');
        el.className='marker';
        new mapboxgl.Marker({
            element :el,
            anchor :'bottom'
        })
        .setLngLat(loc.coordinates)
        .addTo(map);
        
        new mapboxgl.Popup({offset:30})
        .setLngLat(loc.coordinates)
        .setHTML(`<p>${loc.description}</p>`)
        .addTo(map);
    
        bounds.extend(loc.coordinates);
    });
    
    map.fitBounds(bounds,{
        padding:{
            top:200,
            bottom:150,
            right:100,
            left:100
        }
    });
    
}


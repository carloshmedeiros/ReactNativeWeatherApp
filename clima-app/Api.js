export default async function getClima(cordenadas){

    const axios = require('axios')

    const lat = cordenadas.latitude
    
    const lon = cordenadas.longitude

    var dados = []

    await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${cordenadas.latitude}&lon=${cordenadas.longitude}&appid=bcd7020885fe10488354a46ded5528ae`)
        .then(function (props){

            const data = props.data     
            const região = (data.sys.country + ', ' + ' ' + data.name)
            const temperatura = data.main.temp
            
            dados = [temperatura, região]
            
        })
        .catch(function (error) {
            console.log(error)
        })

    return dados
  }
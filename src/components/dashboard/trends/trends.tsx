import { Tdata } from "../../../types";
import { ResponsiveRadialBar } from '@nivo/radial-bar'
import { ResponsiveAreaBump } from '@nivo/bump'

export function Trends({ data }:{ data:Tdata[]}){

    let { yearTrend ,dataForMap} =  getTrends(data);

    return (
        <>
            <h4 className="mx-3 my-3">Trends on top Companies growth over past years & top cities using EV's</h4>
            <div className="flex lg:flex-row md:flex-col sm:flex-col max-sm:flex-col">

            <div className="chart mt-2 mx-3 lg:w-1/2 md:w-full sm:w-full max-sm:w-full h-[20rem]">
                <MyResponsiveAreaBump data={yearTrend} />
            </div>
            <div className="chart mt-2 mx-3 lg:w-1/2 md:w-full sm:w-full max-sm:w-full h-[20rem]">
            { dataForMap && <MyResponsiveRadialBar data={dataForMap} />}
            </div>
            </div>
                
        </>
    )
}

function getTrends(data:Tdata[]){

    let topMakes:{id:string,value:number}[] = JSON.parse(sessionStorage.getItem('topMakes') as string);
    
    let cityObj:{[key:string]:number} = {}

    for(let car of data){
        cityObj[car.City] = cityObj[car.City] ? cityObj[car.City] + 1 : 1;
    }

    let cities = Object.keys(cityObj).sort((a,b) => cityObj[a] - cityObj[b] ).map(x => ( { name:x , Vehicles:cityObj[x]})).splice(-5).reverse();

    let heatMap = cities.map(city => {
        return {
            id:city.name,
            data:topMakes.map(make => ({ "x":make.id, "y": data.filter(car => car.Make == make.id && car.City == city.name).length }))
        }
    })
    
    let yearObj:{[key:string]:number} = {};

    for(let car of data){
        yearObj[car["Model Year"]] = yearObj[car["Model Year"]] ? yearObj[car["Model Year"]] + 1 : 1;
    }

    let topy = Object.keys(yearObj).sort((a,b) => yearObj[a] - yearObj[b])
    .map(x => (
        { 
            year:x,
            count:yearObj[x],
            
        })).splice(-5).reverse().sort((a,b) => parseInt(a.year) - parseInt(b.year));


    let topModels = new Map<string,number>();
    let cars:{[ket:string]:Tdata[]} = {}
    
    for(let car of data){
        if(Object.keys(yearObj).includes(car["Model Year"])){
            let count = topModels.get(car.Make) ? (topModels.get(car.Make) as number) + 1 : 1
            topModels.set(car.Make, count);
            
            if(cars[car.Make]){
                cars[car.Make].push(car)
            } else {
                cars[car.Make] = [car];
            }        
        }
    }

    let modelObj = Object.fromEntries(topModels);

    let top4 = Object.keys(modelObj).sort((a,b) => modelObj[a] - modelObj[b])
    .map(x => (
        { 
            model:x,
            count:modelObj[x],
            
        })).splice(-5).reverse();

    let finalData = top4.map(model => ({
        id:model.model,
        data:topy.map(year => ({
            x:year.year,
            "y":cars[model.model].filter(car => car["Model Year"] == year.year).length
        }))
    }))

    return {
        yearTrend:finalData,
        dataForMap:heatMap
    }  
    
}

const MyResponsiveRadialBar = ({ data }:any) => (
    <ResponsiveRadialBar
        data={data}
        maxValue={5000}
        valueFormat=">-.2f"
        padding={0.4}
        cornerRadius={2}
        margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
        radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 80,
                translateY: 0,
                itemsSpacing: 6,
                itemDirection: 'left-to-right',
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 18,
                symbolShape: 'square',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />
)

const MyResponsiveAreaBump = ({ data /* see data tab */ }:any) => (
    <ResponsiveAreaBump
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
        spacing={8}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'CoffeeScript'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'TypeScript'
                },
                id: 'lines'
            }
        ]}
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -36,
            truncateTickAt: 0
        }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
    />
)
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveHeatMap } from '@nivo/heatmap'
import { Tdata } from "../../../types";

export function DemoGraphics({ data }:{ data:Tdata[]}){

    let { cities,heatMap } = getChartData(data);
    sessionStorage.setItem('heatMap',JSON.stringify(heatMap));


    return (
        <>
            <div className="mx-4">
                <h4 className="text-2xl mb-4">Vehicle DemoGraphics Overview</h4>

                <p className="mx-4 text-slate-800 my-2">Top cities for EV's & Heatmap of top cities with top makes </p>
                <div className="flex gap-2 lg:flex-row md:flex-col sm:flex-col max-sm:flex-col">

                <div className="card lg:w-1/2 md:w-full sm:w-full max-sm:w-full h-[50vh] bg-orange-50 rounded-lg shadow-md">
                    {cities && MyResponsiveBar({ data:cities }) }
                </div>
                <div className="card lg:w-1/2 md:w-full sm:w-full max-sm:w-full h-[50vh] bg-orange-50 rounded-lg shadow-md">
                    {heatMap && MyResponsiveHeatMap({ data:heatMap }) }
                </div>
                </div>
            </div>
        </>
    )
}

function getChartData(data:Tdata[]){

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

    return {
        cities,
        heatMap
    };
}

const MyResponsiveBar = ({ data /* see data tab */ }:any) => (
    <ResponsiveBar
        data={data}
        keys={[
            'Vehicles',
        ]}
        indexBy="name"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
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
        
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'City',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'EV',
            legendPosition: 'middle',
            legendOffset: -40,
            truncateTickAt: 0
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.6
                ]
            ]
        }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        role="application"
        ariaLabel="Nivo bar chart"
        barAriaLabel={(e:any)=>e.id+": "+e.formattedValue+" in city "+e.indexValue}
    />
)
const MyResponsiveHeatMap = ({ data /* see data tab */ }:any) => (
    <ResponsiveHeatMap
        data={data}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        valueFormat=">-.2s"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -90,
            legend: '',
            legendOffset: 46,
            truncateTickAt: 0
        }}
        axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 70,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: -72,
            truncateTickAt: 0
        }}
        colors={{
            type: 'diverging',
            scheme: 'red_yellow_blue',
            divergeAt: 0.5,
            minValue: 50,
            maxValue: 5000
        }}
        emptyColor="#555555"
        legends={[
            {
                anchor: 'bottom',
                translateX: 0,
                translateY: 30,
                length: 400,
                thickness: 8,
                direction: 'row',
                tickPosition: 'after',
                tickSize: 3,
                tickSpacing: 4,
                tickOverlap: false,
                tickFormat: '>-.2s',
                title: 'Value →',
                titleAlign: 'start',
                titleOffset: 4
            }
        ]}
    />
)


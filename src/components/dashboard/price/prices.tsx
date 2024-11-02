import { Tdata } from "../../../types";
import { ResponsiveBar } from '@nivo/bar'

export function Prices({ data }: { data: Tdata[] }) {

    let { rangeBarData, priceBarData } = getPrices(data);

    return (
        <>
            <p className="mx-3 text-center">Average Ranges and Prices of EV companies</p>
            <div className="flex flex-col gap-3 mx-2">

                <div className="w-full h-[16rem] bg-orange-50 rounded-md shadow-md">
                    <MyResponsiveBar data={rangeBarData} indexBy={"name"} keys={["Average Range"]} > </MyResponsiveBar>
                </div>
                <div className="w-full h-[18rem] bg-orange-50 rounded-md shadow-md">
                    <MyResponsiveBar data={priceBarData} indexBy={"name"} keys={["Average Price"]} > </MyResponsiveBar>
                </div>
            </div>
        </>
    )
}

function getPrices(data:Tdata[]){   
    
    let topMakes:{
        name:string,
        data:Tdata[],
        avgPrice?:number
        avgRange?:number
    }[] = JSON.parse(sessionStorage.getItem('top10makes') as string)
    .map((x:{name:string}) => (
        { 
            name: x.name,
            data:data.filter(car =>  car["Make"] == x.name)
        }
        ));
    
        
    topMakes.forEach(val => {
        let totalPrices = data.filter(x => x.Make == val.name && parseInt(x["Base MSRP"])).length;
        let totalRanges = data.filter(x => x.Make == val.name && parseInt(x["Electric Range"])).length;
        val.avgPrice = (val.data.reduce((acc,val) => acc + parseInt(val["Base MSRP"]),0) / totalPrices) || 0
        val.avgRange = (val.data.reduce((acc,val) => acc + parseInt(val["Electric Range"]),0) / totalRanges) || 0;
    })
    let rangeBarData = topMakes.map(x => ({name:x.name , "Average Range":x.avgRange?.toFixed(2)}));
    let priceBarData = topMakes.map(x => ({name:x.name , "Average Price":x.avgPrice?.toFixed(2) }));

    return {
        rangeBarData,
        priceBarData
    }
}

const MyResponsiveBar = ({ data , keys,indexBy}:any) => (
    <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
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
            legend: 'name',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
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
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={e=>e.id+": "+e.formattedValue+" in country: "+e.indexValue}
    />
)
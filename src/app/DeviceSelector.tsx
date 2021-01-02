

import React, { useEffect, useState } from "react";

import Select from 'react-select';

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: "white",
		backgroundColor: "#333333",
		fontSize:14

  }),
  control: (provided) => ({
		// none of react-select's styles are passed to <Control />
		...provided,
		backgroundColor: "#333333",
		color: "white"
		,
		fontSize:14
    // width: 200,
  }),
  menu: (provided) => ({
		// none of react-select's styles are passed to <Control />
		...provided,
		backgroundColor: "#333333",
		color: "white"
    // width: 200,
  }),
  singleValue: (provided, state) => {

		return { ...provided, color: "white",
	};
  }
}

const CustomSelectValue = props => (
  <div>
		<span style={{
			opacity: 0.5
		}}>Spotify device: </span>
    {props.data.label}
  </div>
)

const NoDeviceSelectValue = props => (
  <div style={{color:"orange"}}>
    Please start spotify on one of your devices!
  </div>
)

export default ({ spotify }) => {
	const [devices, setDevices] = useState(spotify.devices)
	const devicesPlus = devices.map(d => ({
		...d,
		label: d.name == "Slapper.io" ? d.name + " (browser)" : d.name,
		value: d.id
	}))

	const activeDevice = devicesPlus.find(d => d.is_active) || {}

	useEffect(() => {
		spotify.onUpdateDevices = (devices) => {
			setDevices(devices)
		}
	}, [])
	return (
		<div style={{
			marginTop: 20
		}}>
			<Select
				styles={customStyles}
				value={activeDevice}
				isSearchable={false}
				onChange={(a) => {
					console.log(a)
					spotify.api.transferMyPlayback([a.id])
				}}
				options={devicesPlus}

  components={{ SingleValue: devicesPlus.length ? CustomSelectValue : NoDeviceSelectValue }}
			/>
		</div>
	)
}

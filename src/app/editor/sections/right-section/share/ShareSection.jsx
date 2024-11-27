import { useContext, useState } from 'react'
import { useAccount, useChains } from 'wagmi'
import EmojiPicker, { EmojiStyle, Emoji } from 'emoji-picker-react'
import { DateTimePicker } from '@atlaskit/datetime-picker'
import { chainLogo, getFromLocalStorage } from '../../../../../utils'
import { Context } from '../../../../../providers/context/ContextProvider'
import BsX from '@meronex/icons/bs/BsX'
import { Button, Textarea, Typography } from '@material-tailwind/react'
import logoSolana from '../../../../../assets/logos/logoSolana.png'
import logoFarcaster from '../../../../../assets/logos/logoFarcaster.jpg'
import logoTwitter from '../../../../../assets/logos/X_logo.png'
import { InputBox } from '../../../common'
import { X_Logo } from '../../../../../assets'
import DownloadBtn from '../../top-section/download/DownloadBtn'
import { usePrivy } from '@privy-io/react-auth'
import { useLocalStorage } from '../../../../../hooks/app'
import usePrivyAuth from '../../../../../hooks/privy-auth/usePrivyAuth'
import { EVMWallets } from '../../top-section/auth/wallets'
import { claimReward } from '../../../../../services'
import WatermarkRemover from './components/WatermarkRemover'
import { baseSepolia } from 'viem/chains'
import { toast } from 'react-toastify'

const ShareSection = () => {
	const chains = useChains()
	const {
		setMenu,
		postName,
		setPostName,
		postDescription,
		setPostDescription,
		stFormattedDate,
		setStFormattedDate,
		stFormattedTime,
		setStFormattedTime,
		stCalendarClicked,
		setStCalendarClicked,
		setZoraTab,

		isShareOpen,
		setIsShareOpen,

		contextCanvasIdRef,
		actionType,
		isMobile,
	} = useContext(Context)
	const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false)
	const [charLimitError, setCharLimitError] = useState('')
	const { authenticated, login: privyLogin } = usePrivy()
	const { evmAuth } = useLocalStorage()
	const { login } = usePrivyAuth()

	const chainsArray = [
		{
			id: 1,
			name: 'Ethereum',
		},
		{
			id: 8453,
			name: 'Base',
		},
		{
			id: 7777777,
			name: 'Zora',
		},
		{
			id: 10,
			name: 'OP Mainnet',
		},
		{
			id: 42161,
			name: 'Arbitrum One',
		},
		{
			id: 1155,
			name: 'Story IP',
		},
	]

	const filterChains = () => {
		if (chains?.length > 0) {
			return chains?.slice(0, -4)
		} else {
			return chainsArray
		}
	}

	// Calendar Functions:
	const onCalChange = (value, dateString) => {
		const dateTime = new Date(value)

		// Format the date
		const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
		setStFormattedDate(dateTime.toLocaleDateString(undefined, dateOptions))

		// Format the time
		const timeOptions = {
			hour: 'numeric',
			minute: 'numeric',
			timeZoneName: 'short',
		}
		setStFormattedTime(dateTime.toLocaleTimeString(undefined, timeOptions))
	}

	// Function to handle emoji click
	// Callback sends (data, event) - Currently using data only
	function fnEmojiClick(emojiData) {
		setPostDescription(postDescription + emojiData?.emoji) //Add emoji to description
	}

	const handleInputChange = (e) => {
		const value = e.target.value
		const name = e.target.name
		const maxByteLimit = 195
		const byteLength = new TextEncoder().encode(value).length

		if (name === 'title') {
			setPostName(value)
			if (isMobile) {
				setPostName('Default Title')
			}
		} else if (name === 'description') {
			if (byteLength > maxByteLimit) {
				setCharLimitError('Maximun character limit exceeded')
				setPostDescription(value.substring(0, value.length - (byteLength - maxByteLimit)))
			} else {
				setCharLimitError('')
				setPostDescription(value)
			}
		}
	}

	const setState = () => {
		setMenu('ERC1155')
		setZoraTab('ERC1155')
	}

	const setCurrentMenu = (menu) => {
		setMenu(menu)
		// if (contextCanvasIdRef?.current) {
		// 	setMenu(menu)
		// } else {
		// 	toast.error('Please create a frame first')
		// }
	}

	return (
		<>
			<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-md rounded-lg  rounded-r-none ">
				<div className="">
					{/* <Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
          Share this Design
        </Dialog.Title> */}

					{/* Don't add - `fixed` solved major Bug */}
					<div className="flex flex-row justify-between top-0 w-full text-white text-xl leading-6 p-4 bg-gray-900 rounded-lg rounded-r-none ">
						{/* For alignment */}
						<div className=""> {''} </div>
						<div className="">Share this Design</div>
						<div className="z-100 cursor-pointer" onClick={() => setIsShareOpen(!isShareOpen)}>
							<BsX size="24" />
						</div>
					</div>
				</div>

				{/* Calender For Schedule - 18Jun2023 */}
				<div className={`${!stCalendarClicked && 'hidden'}`}>
					<div
						className={`
          ml-6 mr-6 mb-4`}
					>
						<div className="m-1">Choose schedule time and date</div>
						<DateTimePicker className="m-4" onChange={onCalChange} />
					</div>

					<div className={`flex flex-col m-2 ml-8`}>
						<div className="mt-1 mb-3">Schedule</div>
						<div className="flex flex-row border-l-8 border-l-[#e1f16b] p-4 rounded-md">
							<div className="flex flex-col">
								<div className="text-4xl text-[#E699D9]">{stFormattedDate.slice(0, 2)}</div>
								<div className="text-lg text-[#2D346C]">{stFormattedDate.slice(2)}</div>
							</div>

							<div className="flex flex-col ml-4">
								<div className="ml-2 mt-10">{stFormattedTime}</div>
							</div>
						</div>
					</div>
				</div>
				{/* 
        <Button className="mx-6" onClick={fnCallRemoveWatermark}>
          Remove Watermark
        </Button> */}
				{/* Share - Icons - 18Jun2023 */}
				{isMobile &&
					(!evmAuth && actionType !== 'composer' ? (
						<EVMWallets title={'Login with EVM'} className="mx-2" login={login} />
					) : (
						<div className="flex flex-col mt-4 gap-2">
							<Button className="mx-6" onClick={() => setMenu('farcasterShare')}>
								Share on Farcaster
							</Button>

							{actionType !== 'composer' && (
								<Button className="mx-6" onClick={() => setMenu('xshare')}>
									Share on X
								</Button>
							)}

							<Button className="mx-6" onClick={setState}>
								Create 1155 edition
							</Button>
						</div>
					))}
				{!isMobile && (
					<>
						<hr />
						<div className={`relative mt-6 px-4 sm:px-6`}>
							<p className="text-lg">Share on socials</p>
							<div className="flex ">
								<>
									<div className="flex items-center space-x-12 py-5">
										<div onClick={() => setCurrentMenu('farcasterShare')}>
											{' '}
											<img className="w-10 cursor-pointer rounded-md" src={logoFarcaster} alt="Farcaster" />{' '}
										</div>
									</div>
									<div className={`flex items-center py-5 space-x-12 ${!isMobile ? 'ml-8' : ' '}`}>
										<div onClick={() => setCurrentMenu('xshare')}>
											{' '}
											<img className="w-10 cursor-pointer rounded-md" src={logoTwitter} alt="X" />{' '}
										</div>
									</div>
									<div className={`flex items-center py-5 space-x-12 ${!isMobile ? 'ml-8' : ' '}`}>
										<div onClick={() => setCurrentMenu('lensmonetization')}>
											{' '}
											<img className="w-10 cursor-pointer" src="/other-icons/share-section/iconLens.png" alt="Lens" />{' '}
										</div>
									</div>
								</>
							</div>
						</div>
						<hr />

						<div className={`relative mt-6 px-4 sm:px-6`}>
							<p className="text-lg">Mint NFT on Story Protocol</p>
							<div className="flex flex-wrap items-center gap-10 my-3">
								<div className="cursor-pointer flex flex-col items-center" onClick={() => setCurrentMenu('storyMint')}>
									<img className="w-10 h-10" src={chainLogo(1155)} alt="Story Protocol" />{' '}
									<Typography className="text-md font-semibold">Story Protocol</Typography>
								</div>
							</div>
						</div>
						<hr />
						<div className={`relative mt-6 px-4 sm:px-6`}>
							<p className="text-lg">Mint as an NFT on EVM</p>
							<div className="flex flex-wrap items-center gap-10 my-3">
								{filterChains().map((item) => {
									return (
										<div key={item?.id} className="cursor-pointer flex flex-col items-center" onClick={() => setCurrentMenu(item?.id)}>
											{' '}
											<img className="w-10 h-10" src={chainLogo(item?.id)} alt={`${item?.name} blockchain logo`} />{' '}
											<Typography className="text-md font-semibold">{item?.name}</Typography>
										</div>
									)
								})}
							</div>
						</div>
						<hr />

						<div className={`relative mt-6 px-4 sm:px-6`}>
							<p className="text-lg">Mint as an NFT on Solana</p>
							<div className="flex flex-wrap items-center gap-10 my-3">
								<div className="cursor-pointer flex flex-col items-center" onClick={() => setCurrentMenu('solanaMint')}>
									{' '}
									<img className="w-10" src={logoSolana} alt="Solana" /> <Typography className="text-md font-semibold">Solana</Typography>
								</div>
							</div>
						</div>
						<hr />
					</>
				)}
				{isMobile && <hr className="my-6" />}
				<div className={`${isMobile ? 'mt-0' : 'mt-4'}`}></div>
				<WatermarkRemover />
			</div>
		</>
	)
}

export default ShareSection

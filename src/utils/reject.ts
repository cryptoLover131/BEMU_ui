export const isUserRejected = (err) => {
	return typeof err === 'object' && err.toString().includes('User rejected the request.')
}
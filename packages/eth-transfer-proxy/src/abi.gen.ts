// WARNING this file is generated automatically by 'yarn build:gen'
export const ETHTransferProxyABI = [{"type":"function","name":"transferETH","inputs":[{"name":"receiver","type":"address","internalType":"address payable"}],"outputs":[],"stateMutability":"payable"},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ETHTransferFailed","inputs":[]}] as const;
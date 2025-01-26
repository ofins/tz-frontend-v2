const ImageWrapper = ({ url, className }: { url: string; className?: string }) => {
  if (!url) return 'No Image'
  return (
    <img
      src={url}
      alt={`Image: ${url}`}
      className={className}
      onError={(e) => {
        e.currentTarget.src = ''
        e.currentTarget.alt = 'No Image'
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}

export default ImageWrapper

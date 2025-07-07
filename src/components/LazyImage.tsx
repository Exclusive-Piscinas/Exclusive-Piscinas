import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

const LazyImage = ({ src, alt, className = "", placeholder }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {inView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {(!inView || (!isLoaded && !hasError)) && (
        <div className={`bg-muted animate-pulse ${className}`}>
          {placeholder && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              {placeholder}
            </div>
          )}
        </div>
      )}
      
      {hasError && (
        <div className={`bg-muted flex items-center justify-center ${className}`}>
          <span className="text-muted-foreground text-sm">Erro ao carregar imagem</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
import React, { Suspense } from "react";

import { CachedImage } from "@georstat/react-native-image-cache";
import { IconLoadingDataComponent } from "../LoadingComponent";

const ImageLoaderComponent = (props: any) => {
  return (
    <Suspense fallback={<IconLoadingDataComponent />}>
      <CachedImage
        source={props.source}
        style={{ ...props.style, overflow: "hidden" }}
        resizeMode={props.resizeMode}
        thumbnailSource={props?.thumbnailSource}
      />
    </Suspense>
  );
};

export default ImageLoaderComponent;

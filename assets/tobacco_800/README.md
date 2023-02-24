# Tobacco800 Complex Document Image Database and Groundtruth

## Tobacco800 Document Image Database

Publicly accessible document image collection with realistic scope and complexity is important to the document image analysis and search community. Tobacco800 is a public subset of the complex document image processing (CDIP) test collection constructed by Illinois Institute of Technology, assembled from 42 million pages of documents (in 7 million multi-page TIFF images) released by tobacco companies under the Master Settlement Agreement and originally hosted at UCSF.

Tobacco800, composed of 1290 document images, is a realistic database for document image analysis research as these documents were collected and scanned using a wide variety of equipment over time. In addition, a significant percentage of Tobacco800 are consecutively numbered multi-page business documents, making it a valuable testbed for various content-based document image retrieval approaches. Resolutions of documents in Tobacco800 vary significantly from 150 to 300 DPI and the dimensions of images range from 1200 by 1600 to 2500 by 3200 pixels.

Please include the following reference(s) when citing the Tobacco800 database:

* D. Lewis, G. Agam, S. Argamon, O. Frieder, D. Grossman, and J. Heard, “Building a test collection for complex document information processing,” in Proc. 29th Annual Int. ACM SIGIR Conference (SIGIR 2006), pp. 665–666, 2006. [BibTex](http://www.umiacs.umd.edu/~zhugy/Docs/SIGIR2006_BibTex.html)
* G. Agam, S. Argamon, O. Frieder, D. Grossman, and D. Lewis, The Complex Document Image Processing (CDIP) test collection project, Illinois Institute of Technology, 2006. [http://ir.iit.edu/projects/CDIP.html](http://ir.iit.edu/projects/CDIP.html). [BibTex](http://www.umiacs.umd.edu/~zhugy/Docs/CDIP2006_BibTex.html)
* The Legacy Tobacco Document Library (LTDL), University of California, San Francisco, 2007.[http://legacy.library.ucsf.edu/](http://legacy.library.ucsf.edu/). [BibTex](http://www.umiacs.umd.edu/~zhugy/Docs/LTDL2007_BibTex.html)


## Overview of Tobacco800 Groundtruth v2.0

The groundtruth of the Tobacco800 document image database was created by the Language and Media Processing Laboratory, University of Maryland. This new release includes the groundtruth information on both signatures and logos in this large complex document image collection.

Including the location and dimensions of each visual entity, the XML groundtruth v2.0 also contains the true identity of each signature instance, enabling evaluation of signature matching and authorship attribution.

Please include the following reference(s) for the Tobacco800 groundtruth:

* Guangyu Zhu, Yefeng Zheng, David Doermann,and Stefan Jaeger. Multi-scale Structural Saliency for Signature Detection. In Proc. IEEE Conf. Computer Vision and Pattern Recognition (CVPR 2007), pp. 1‐8, 2007.
* Guangyu Zhu and David Doermann. Automatic Document Logo Detection. In Proc. 9th Int. Conf. Document Analysis and Recognition (ICDAR 2007), pp. 864‐868, 2007.

The BibTex entries:

```
@inproceedings{SignatureDetection-CVPR07,
   AUTHOR    = {Guangyu Zhu and Yefeng Zheng and David Doermann and Stefan Jaeger},
   TITLE     = {Multi-scale Structural Saliency for Signature Detection},
   BOOKTITLE = {In Proc. IEEE Conf. Computer Vision and Pattern Recognition (CVPR 2007)},
   PAGES     = {1--8},
   YEAR      = {2007},
}

@inproceedings{LogoDetection-ICDAR07,
   AUTHOR    = {Guangyu Zhu and David Doermann},
   TITLE     = {Automatic Document Logo Detection},
   BOOKTITLE = {In Proc. 9th Int. Conf. Document Analysis and Recognition (ICDAR 2007)},
   PAGES     = {864--868},
   YEAR      = {2007},
}
```
import * as cdk from "aws-cdk-lib";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { CloudFront } from "./constructs/cloudfront";

export class CloudfrontS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const webBucket = new Bucket(this, "WebBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const originAccessIdentity = new cdk.aws_cloudfront.OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );

    const origin = new S3Origin(webBucket, {
      originAccessIdentity,
    });

    const cloudfront = new CloudFront(this, "CloudFront", {
      origin,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.seconds(0),
        },
      ],
    });

    new BucketDeployment(this, "WebDeploy", {
      sources: [
        Source.data(
          "/index.html",
          "<html><body><h1>Hello World</h1></body></html>"
        ),
      ],
      destinationBucket: webBucket,
      distribution: cloudfront.distribution,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "Endpoint", {
      value: cloudfront.distribution.distributionDomainName,
    });
  }
}

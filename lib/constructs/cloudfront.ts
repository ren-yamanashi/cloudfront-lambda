import { Duration } from "aws-cdk-lib";
import {
  CachePolicy,
  Distribution,
  IDistribution,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { FunctionUrlOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { IFunctionUrl } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface CloudFrontProps {
  readonly functionUrl: IFunctionUrl;
}

export class CloudFront extends Construct {
  public readonly distribution: IDistribution;

  constructor(scope: Construct, id: string, props: CloudFrontProps) {
    super(scope, id);

    const origin = new FunctionUrlOrigin(props.functionUrl);

    const cachePolicy = new CachePolicy(this, "CachePolicy", {
      minTtl: Duration.seconds(0),
      maxTtl: Duration.days(365),
      defaultTtl: Duration.hours(24),
    });

    this.distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin,
        cachePolicy,
        viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
      },
    });
  }
}

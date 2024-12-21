import { Duration } from "aws-cdk-lib";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  ErrorResponse,
  IDistribution,
  IOrigin,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { Construct } from "constructs";

export interface CloudFrontProps {
  readonly origin: IOrigin;
  readonly errorResponses?: ErrorResponse[];
}

export class CloudFront extends Construct {
  public readonly distribution: IDistribution;

  constructor(scope: Construct, id: string, props: CloudFrontProps) {
    super(scope, id);

    const cachePolicy = new CachePolicy(this, "CachePolicy", {
      minTtl: Duration.seconds(0),
      maxTtl: Duration.days(365),
      defaultTtl: Duration.hours(24),
    });

    const responseHeadersPolicy = new ResponseHeadersPolicy(
      this,
      "ResponseHeaderPolicy",
      {
        corsBehavior: {
          accessControlAllowOrigins: ["https://example.com"],
          accessControlAllowHeaders: ["*"],
          accessControlAllowMethods: ["ALL"],
          accessControlAllowCredentials: false,
          originOverride: true,
        },
      }
    );

    this.distribution = new Distribution(this, "Distribution", {
      errorResponses: props.errorResponses,
      defaultBehavior: {
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        origin: props.origin,
        responseHeadersPolicy,
      },
    });
  }
}

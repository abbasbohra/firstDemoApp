import { FC } from 'react';
import { ViewStyle } from 'react-native';
import { TextStyles } from '../../types';
export interface PrimaryButtonProps {
    currentPage?: number;
    goToNextPage: () => void;
    style?: ViewStyle;
    totalPages?: number;
    text?: string;
    disabled?: boolean;
}
export declare const PrimaryButton: FC<PrimaryButtonProps & TextStyles>;
